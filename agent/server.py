import os
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Load environment variables
load_dotenv()

app = FastAPI(title="Accomplishment Agent API")

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
    api_key="not-needed",  # llama.cpp doesn't require API key
)

parser = JsonOutputParser(pydantic_object=AccomplishmentParsed)

# Prompt to extract structured data from natural language
prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are a helpful assistant that extracts structured data from accomplishment-focused messages.

You MUST respond with valid JSON only. Do not include any text before or after the JSON object.

    Your response MUST be valid JSON that matches the provided schema. Populate:
    - title: concise accomplishment summary (string, required)
    - description: supporting detail (string, optional)
    - category: best-fit category (string, optional, infer when possible)
    - tags: relevant short keywords (array of strings, optional)
    - confidence: float from 0 to 1 indicating how certain you are (1 = certain)
    - status: "parsed" when confident, otherwise "low_confidence"
    - reasoning: brief explanation when confidence < 0.75

    Never invent accomplishments if the input is unrelated; instead lower confidence and explain.
    {format_instructions}
    """,
    ),
    ("human", "{input}"),
])

chain = prompt | llm | parser

# --- Routes ---

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": ollama_model}

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
        # Invoke the LLM chain
        result = chain.invoke({
            "input": data.input,
            "format_instructions": parser.get_format_instructions()
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
