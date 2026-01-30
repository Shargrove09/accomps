import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header

from cache import TagCategoryCache
from schemas import MessageInput, AccomplishmentParsed
from parser_chain import chain, parser, llm_model

# Load environment variables
load_dotenv()

app = FastAPI(title="Accomplishment Agent API")

# Initialize cache (ttl_seconds=0 means load once at startup)
# To enable auto-refresh: change to TagCategoryCache(ttl_seconds=300) for 5-minute cache
cache = TagCategoryCache(ttl_seconds=0)

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
