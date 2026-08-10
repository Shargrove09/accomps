import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

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

# --- Description generation chain ---
# Produces a single natural-language sentence describing an accomplishment, used
# by the /api/generate-description endpoint (web form + create-time fallback).
description_prompt = ChatPromptTemplate.from_messages([
    ("system", """You write a single concise, natural-language sentence describing an accomplishment.

Rules:
- Output ONLY the description sentence. No quotes, no preamble, no markdown, no JSON.
- Exactly one sentence, under 200 characters, in the past tense where natural.
- Base it on the title (and category/tags/context if provided). Do NOT invent
  specific facts, numbers, names, or outcomes not implied by the input.
"""),
    ("human", "Title: {title}\nCategory: {category}\nTags: {tags}\nContext: {context}\n\nDescription:"),
])

description_chain = description_prompt | llm | StrOutputParser()
