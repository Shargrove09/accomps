import os
from typing import List, Optional
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

# Load environment variables
load_dotenv()

app = FastAPI(title="Accomplishment Agent API")

# --- Data Models ---

class SmsInput(BaseModel):
    input: str
    source: str = "twilio-sms"

class AccomplishmentParsed(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []

# --- LLM Setup ---

ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
print(f"Initializing Agent Server with model: {ollama_model}")

llm = ChatOllama(
    model=ollama_model,
    temperature=0,
    format="json",  # Force JSON mode for reliable parsing
)

parser = JsonOutputParser(pydantic_object=AccomplishmentParsed)

# Prompt to extract structured data from natural language
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a helpful assistant that extracts structured data from SMS messages about accomplishments.
    
    Your goal is to extract:
    - title: A concise summary of the accomplishment.
    - description: Any additional details provided (optional).
    - category: The most appropriate category (e.g., Work, Personal, Learning, Health). Infer if not explicit.
    - tags: A list of relevant tags (e.g., 'coding', 'fitness', 'bugfix').
    
    Return ONLY a valid JSON object matching the requested structure.
    {format_instructions}
    """),
    ("human", "{input}"),
])

chain = prompt | llm | parser

# --- Routes ---

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": ollama_model}

@app.post("/api/parse-sms")
async def parse_sms(data: SmsInput, x_api_key: Optional[str] = Header(None)):
    # Verify API Key
    expected_key = os.getenv("AGENT_API_KEY")
    if expected_key and x_api_key != expected_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if not data.input.strip():
        raise HTTPException(status_code=400, detail="Input cannot be empty")

    print(f"Processing SMS: {data.input}")

    try:
        # Invoke the LLM chain
        result = chain.invoke({
            "input": data.input,
            "format_instructions": parser.get_format_instructions()
        })
        
        print(f"Parsed result: {result}")
        return result

    except Exception as e:
        print(f"Error parsing SMS: {e}")
        # Fallback: return the input as title if parsing fails
        return {
            "title": data.input,
            "category": "SMS",
            "tags": ["sms", "unparsed"],
            "description": "Failed to parse structured data."
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
