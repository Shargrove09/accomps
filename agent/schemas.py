from typing import List, Optional
from pydantic import BaseModel

class DescriptionInput(BaseModel):
    title: str
    category: Optional[str] = None
    tags: List[str] = []
    context: Optional[str] = None
