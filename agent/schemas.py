from typing import List, Optional
from pydantic import BaseModel

class MessageInput(BaseModel):
    input: str
    source: str = "message"

class DescriptionInput(BaseModel):
    title: str
    category: Optional[str] = None
    tags: List[str] = []
    context: Optional[str] = None

class AccomplishmentParsed(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: List[str] = []
    confidence: float = 1.0
    status: str = "parsed"
    reasoning: Optional[str] = None
