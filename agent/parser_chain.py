import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from schemas import AccomplishmentParsed

# Load environment variables
load_dotenv()

# --- LLM Setup ---

llm_model = os.getenv("LLM_MODEL", "llama3.2")
llm_base_url = os.getenv("LLM_BASE_URL", "http://localhost:8081/v1")
print(f"Initializing Chain with model: {llm_model}")
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
