from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer, JSON, Boolean
from sqlalchemy.sql import func
from app.db.database import Base
import uuid


class Problem(Base):
    __tablename__ = "problems"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String, nullable=True)
    time_limit = Column(Integer, default=1000)  # milliseconds
    memory_limit = Column(Integer, default=256)  # MB
    
    # Reference ID used in skill tree nodes
    problem_ref_id = Column(String, nullable=True, unique=True)
    
    # Problem structure
    input_format = Column(Text, nullable=True)
    output_format = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)
    
    # Starter code for different languages
    starter_code = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    created_by = Column(String, ForeignKey("users.id"), nullable=True)


class TestCase(Base):
    __tablename__ = "test_cases"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    problem_id = Column(String, ForeignKey("problems.id", ondelete="CASCADE"), nullable=False)
    
    # Test data
    input_data = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    
    # Visibility and scoring
    is_sample = Column(Boolean, default=False)  # Visible to users
    weight = Column(Integer, default=1)  # For weighted scoring
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now())


class Submission(Base):
    __tablename__ = "submissions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    problem_id = Column(String, ForeignKey("problems.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    
    # Submission details
    code = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    block_structure = Column(JSON, nullable=True)  # Store the block arrangement
    
    # Results
    status = Column(String, default="pending")  # pending, running, accepted, wrong_answer, etc.
    score = Column(Integer, default=0)
    execution_time = Column(Integer, nullable=True)  # in milliseconds
    memory_used = Column(Integer, nullable=True)  # in KB
    
    # Detailed test results
    test_results = Column(JSON, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, server_default=func.now())