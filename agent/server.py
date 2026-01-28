import os
import time
import requests
from typing import List, Optional
from threading import Lock
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Load environment variables
load_dotenv()

app = FastAPI(title="Accomplishment Agent API")

# --- Tag/Category Context Cache ---

class TagCategoryCache:
    """
    Cache for tags and categories to provide context to the LLM.
    
    CURRENT SETUP (Approach 3 - Load Once):
    - Loads tags/categories once on server startup
    - ttl_seconds=0 disables auto-refresh
    - Requires server restart to see new tags/categories
    - Best for: Solo user, stable tag/category list, simplest code
    
    EASY UPGRADE PATH (Approach 2 - Periodic Refresh):
    To enable automatic cache refresh every N minutes:
    1. Change: cache = TagCategoryCache(ttl_seconds=300)  # 5 minutes
    2. That's it! The cache will auto-refresh when stale
    
    Benefits of upgrade:
    - No server restart needed for new tags/categories
    - Still fast (only refreshes when TTL expires)
    - Good for: Multiple users, rapidly evolving tag list
    """
    def __init__(self, ttl_seconds=0):
        self.tags: List[str] = []
        self.categories: List[str] = []
        self.last_updated: float = 0
        self.ttl: int = ttl_seconds  # 0 = load once, >0 = auto-refresh
        self.lock = Lock()
    
    def get_tags(self) -> List[str]:
        """Get cached tags, refreshing if TTL expired (when enabled)."""
        if self.ttl > 0 and time.time() - self.last_updated > self.ttl:
            self._refresh()
        return self.tags
    
    def get_categories(self) -> List[str]:
        """Get cached categories, refreshing if TTL expired (when enabled)."""
        if self.ttl > 0 and time.time() - self.last_updated > self.ttl:
            self._refresh()
        return self.categories
    
    def _refresh(self):
        """Fetch tags and categories from API."""
        with self.lock:
            # Double-check pattern to avoid race conditions
            if self.ttl > 0 and time.time() - self.last_updated <= self.ttl:
                return
            
            self.tags = self._fetch_tags()
            self.categories = self._fetch_categories()
            self.last_updated = time.time()
            print(f"Cache refreshed: {len(self.tags)} tags, {len(self.categories)} categories")
    
    def _fetch_tags(self) -> List[str]:
        """Fetch current tags from the API."""
        api_url = os.getenv("ACCOMPLISHMENT_API_URL", "")
        api_key = os.getenv("AGENT_API_KEY")
        
        if not api_url or not api_key:
            return []
        
        tags_url = api_url.replace("/accomplishments", "/tags")
        
        try:
            response = requests.get(
                tags_url, 
                headers={"x-api-key": api_key},
                timeout=3
            )
            if response.status_code == 200:
                tags_data = response.json()
                return [tag['name'] for tag in tags_data]
        except Exception as e:
            print(f"Warning: Could not fetch tags: {e}")
        
        return []
    
    def _fetch_categories(self) -> List[str]:
        """Fetch current categories from the API."""
        api_url = os.getenv("ACCOMPLISHMENT_API_URL", "")
        api_key = os.getenv("AGENT_API_KEY")
        
        if not api_url or not api_key:
            return []
        
        categories_url = api_url.replace("/accomplishments", "/categories")
        
        try:
            response = requests.get(
                categories_url,
                headers={"x-api-key": api_key},
                timeout=3
            )
            if response.status_code == 200:
                cats_data = response.json()
                return [cat['name'] for cat in cats_data]
        except Exception as e:
            print(f"Warning: Could not fetch categories: {e}")
        
        return []
    
    def load_initial(self):
        """Load tags and categories on startup."""
        self._refresh()

# Initialize cache (ttl_seconds=0 means load once at startup)
# To enable auto-refresh: change to TagCategoryCache(ttl_seconds=300) for 5-minute cache
cache = TagCategoryCache(ttl_seconds=3000)

# --- Data Models ---

class MessageInput(BaseModel):
    input: str
    source: str = "message"

class AccomplishmentParsed(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    confidence: float = 1.0
    status: str = "parsed"
    reasoning: Optional[str] = None

# --- LLM Setup ---

llm_model = os.getenv("LLM_MODEL", "llama3.2")
llm_base_url = os.getenv("LLM_BASE_URL", "http://localhost:8081/v1")
print(f"Initializing Agent Server with model: {llm_model}")
print(f"LLM base URL: {llm_base_url}")

llm = ChatOpenAI(
    model=llm_model,
    temperature=0,
    base_url=llm_base_url,
    api_key="not-needed",  
)

parser = JsonOutputParser(pydantic_object=AccomplishmentParsed)

# Prompt to extract structured data from natural language
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful assistant that extracts structured data from accomplishment-focused messages.

You MUST respond with valid JSON only. Do not include any text before or after the JSON object.
START your response with {{ and END with }}. No markdown blocks, no explanations.

EXISTING TAGS IN SYSTEM: {existing_tags}
EXISTING CATEGORIES IN SYSTEM: {existing_categories}

{format_instructions}

EXAMPLES:
Input: "deployed the new authentication feature to prod"
Output: {{"title": "Deployed new authentication feature to production", "description": "Deployment of authentication feature", "category": "Work", "tags": ["deployment", "authentication", "production"], "confidence": 0.95, "status": "parsed"}}

Input: "learned about react hooks today"
Output: {{"title": "Learned about React hooks", "description": null, "category": "Learning", "tags": ["react", "hooks", "learning"], "confidence": 0.9, "status": "parsed"}}

Input: "what's the weather like?"
Output: {{"title": "what's the weather like?", "description": null, "category": null, "tags": [], "confidence": 0.1, "status": "low_confidence", "reasoning": "Input is not accomplishment-related"}}

RULES:
- title: Capitalize properly, fix typos, make concise (required)
- description: Additional context if evident from input (optional)
- category: MUST be one from existing categories above, or null if unsure (optional)
- tags: PREFER existing tags from the list above for consistency, lowercase, max 5 tags (array)
- confidence: 0.0-1.0 based on certainty this is an accomplishment
- status: "parsed" if confidence >= 0.75, else "low_confidence"
- reasoning: Explain when confidence < 0.75

TAG GUIDELINES:
- Prefer reusing existing tags from the system to maintain consistency
- Only create new tags if the accomplishment requires a concept not covered
- Use lowercase, single words or hyphenated phrases
- Examples: ["deployment", "bug-fix", "learning"] not ["Accomplishment", "WORK"]

CATEGORY GUIDELINES:
- ONLY use categories that exist in the system above
- If input doesn't clearly match a category, set to null
- Common mappings: deployments/features → Work, tutorials/courses → Learning, exercise → Health

Never invent accomplishments. If input is unclear or unrelated, set low confidence.
     """),
    ("human", "{input}"),
])

chain = prompt | llm | parser

# --- Routes ---

@app.on_event("startup")
async def startup_event():
    """Load tags and categories on server startup."""
    print("Loading tags and categories...")
    cache.load_initial()
    print(f"Loaded {len(cache.get_tags())} tags and {len(cache.get_categories())} categories")

@app.get("/health")
async def health_check():
    return {
        "status": "ok", 
        "model": llm_model,
        "cached_tags": len(cache.get_tags()),
        "cached_categories": len(cache.get_categories())
    }

@app.post("/api/parse-message")
async def parse_message(data: MessageInput, x_api_key: Optional[str] = Header(None)):
    # Verify API Key
    expected_key = os.getenv("AGENT_API_KEY")
    if expected_key and x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not data.input.strip():
        raise HTTPException(status_code=400, detail="Input cannot be empty")

    print(f"Processing message from {data.source}: {data.input}")

    try:
        # Get current tags and categories for context
        existing_tags = cache.get_tags()
        existing_categories = cache.get_categories()
        
        # Build context strings (limit to avoid token bloat)
        tags_context = ", ".join(existing_tags[:50]) if existing_tags else "none yet"
        categories_context = ", ".join(existing_categories) if existing_categories else "General"
        
        # Invoke the LLM chain
        result = chain.invoke({
            "input": data.input,
            "format_instructions": parser.get_format_instructions(),
            "existing_tags": tags_context,
            "existing_categories": categories_context,
        })

        parsed_dict = result.dict() if isinstance(result, AccomplishmentParsed) else result
        confidence = parsed_dict.get("confidence", 1.0)
        # Clamp confidence into valid range to avoid downstream surprises
        confidence = max(0.0, min(1.0, float(confidence)))
        status = parsed_dict.get("status") or ("parsed" if confidence >= 0.75 else "low_confidence")

        enriched_response = {
            **parsed_dict,
            "confidence": confidence,
            "status": status,
            "raw_input": data.input,
            "source": data.source,
        }

        print(f"Parsed result: {enriched_response}")
        return enriched_response

    except Exception as e:
        print(f"Error parsing message: {e}")
        # Fallback: return the input as title if parsing fails
        return {
            "title": data.input,
            "category": "General",
            "tags": [data.source, "unparsed"],
            "description": "Failed to parse structured data.",
            "confidence": 0.0,
            "status": "fallback",
            "raw_input": data.input,
            "source": data.source,
            "reasoning": str(e),
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
