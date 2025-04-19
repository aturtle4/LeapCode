from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, JSON
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class SkillTree(Base):
    __tablename__ = "skill_trees"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    guide = Column(String, nullable=True)
    bg_color = Column(String, default="#3498db")

    # Nodes/content for the skill tree
    nodes = Column(JSON, nullable=True, default=list)

    # Google Classroom integration
    classroom_id = Column(String, nullable=True)
    classroom_url = Column(String, nullable=True)
    classroom_name = Column(String, nullable=True)

    # Progress tracking
    percentage_completed = Column(Integer, default=0)
    next_deadline = Column(DateTime, nullable=True)

    # Metadata
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
