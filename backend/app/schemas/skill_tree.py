from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime


class SkillTreeBase(BaseModel):
    title: str
    description: Optional[str] = None
    guide: Optional[str] = None
    bg_color: Optional[str] = "#3498db"
    nodes: Optional[List[Dict[str, Any]]] = []


class SkillTreeCreate(SkillTreeBase):
    pass


class SkillTreeClassroomLink(BaseModel):
    skill_tree_id: str
    classroom_id: str


class SkillTreeResponse(SkillTreeBase):
    id: str
    percentage_completed: Optional[int] = 0
    classroom_id: Optional[str] = None
    classroom_url: Optional[str] = None
    classroom_name: Optional[str] = None
    next_deadline: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
