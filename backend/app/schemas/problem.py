from typing import Optional, List, Dict, Any
from pydantic import BaseModel
from datetime import datetime


# Problem Schemas
class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: Optional[str] = None
    time_limit: Optional[int] = 1000
    memory_limit: Optional[int] = 256
    input_format: Optional[str] = None
    output_format: Optional[str] = None
    constraints: Optional[str] = None
    starter_code: Optional[Dict[str, str]] = None
    problem_ref_id: Optional[str] = None


class ProblemCreate(ProblemBase):
    pass


class ProblemUpdate(ProblemBase):
    title: Optional[str] = None
    description: Optional[str] = None


class ProblemResponse(ProblemBase):
    id: str
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# TestCase Schemas
class TestCaseBase(BaseModel):
    input_data: str
    expected_output: str
    is_sample: Optional[bool] = False
    weight: Optional[int] = 1


class TestCaseCreate(TestCaseBase):
    problem_id: str


class TestCaseUpdate(TestCaseBase):
    input_data: Optional[str] = None
    expected_output: Optional[str] = None


class TestCaseResponse(TestCaseBase):
    id: str
    problem_id: str
    created_at: datetime

    class Config:
        from_attributes = True


# Submission Schemas
class SubmissionBase(BaseModel):
    code: str
    language: str
    block_structure: Optional[Dict[str, Any]] = None


class SubmissionCreate(SubmissionBase):
    problem_id: str


class SubmissionResponse(SubmissionBase):
    id: str
    problem_id: str
    user_id: str
    status: str
    score: int
    execution_time: Optional[int] = None
    memory_used: Optional[int] = None
    test_results: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True