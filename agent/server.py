import os
from typing import Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header

from schemas import DescriptionInput
from parser_chain import llm_model, description_chain

# Load environment variables
load_dotenv()

app = FastAPI(title="Accomplishment Agent API")

# --- Routes ---

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model": llm_model,
    }

@app.post("/api/generate-description")
async def generate_description(data: DescriptionInput, x_api_key: Optional[str] = Header(None)):
    # Verify API Key
    expected_key = os.getenv("AGENT_API_KEY")
    if expected_key and x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not data.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")

    # Deterministic fallback used if the LLM call fails.
    title = data.title.strip()
    fallback = f"{title} ({data.category})." if data.category else f"{title}."

    try:
        tags_str = ", ".join(data.tags) if data.tags else "none"
        description = description_chain.invoke({
            "title": title,
            "category": data.category or "none",
            "tags": tags_str,
            "context": data.context or "none",
        })
        description = (description or "").strip()
        return {"description": description or fallback}
    except Exception as e:
        print(f"Error generating description: {e}")
        return {"description": fallback}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
