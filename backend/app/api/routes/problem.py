from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.api.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.problem import Problem, TestCase, Submission
from app.schemas.problem import (
    ProblemCreate, 
    ProblemResponse, 
    ProblemUpdate,
    TestCaseCreate,
    TestCaseResponse,
    TestCaseUpdate,
    SubmissionCreate,
    SubmissionResponse
)

router = APIRouter(
    tags=["problems"],
    responses={404: {"description": "Not found"}},
)


@router.post("/", response_model=ProblemResponse, status_code=status.HTTP_201_CREATED)
def create_problem(
    problem: ProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new problem (teachers/admin only)."""
    if not current_user.is_teacher and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create problems"
        )
        
    # Create a problem reference ID if not provided
    if not problem.problem_ref_id:
        problem.problem_ref_id = f"P{Problem.count() + 1}"
        
    db_problem = Problem(**problem.dict(), created_by=current_user.id)
    db.add(db_problem)
    db.commit()
    db.refresh(db_problem)
    return db_problem


@router.get("/", response_model=List[ProblemResponse])
def get_problems(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get all problems."""
    problems = db.query(Problem).offset(skip).limit(limit).all()
    return problems


@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get a specific problem by ID."""
    problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    return problem


@router.put("/{problem_id}", response_model=ProblemResponse)
def update_problem(
    problem_id: str,
    problem: ProblemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a problem (teachers/admin only)."""
    if not current_user.is_teacher and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update problems"
        )
        
    db_problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not db_problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    
    # Update problem fields
    for key, value in problem.dict(exclude_unset=True).items():
        setattr(db_problem, key, value)
    
    db.commit()
    db.refresh(db_problem)
    return db_problem


@router.delete("/{problem_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_problem(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a problem (teachers/admin only)."""
    if not current_user.is_teacher and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete problems"
        )
        
    db_problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not db_problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    
    db.delete(db_problem)
    db.commit()
    return None


# Test Case endpoints
@router.post("/test-cases", response_model=TestCaseResponse, status_code=status.HTTP_201_CREATED)
def create_test_case(
    test_case: TestCaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new test case for a problem (teachers/admin only)."""
    if not current_user.is_teacher and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create test cases"
        )
    
    # Verify the problem exists
    problem = db.query(Problem).filter(Problem.id == test_case.problem_id).first()
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    
    db_test_case = TestCase(**test_case.dict())
    db.add(db_test_case)
    db.commit()
    db.refresh(db_test_case)
    return db_test_case


@router.get("/{problem_id}/test-cases", response_model=List[TestCaseResponse])
def get_test_cases(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get test cases for a problem."""
    # Check if user is teacher/admin for non-sample test cases
    if not current_user.is_teacher and not current_user.is_admin:
        # Regular users can only see sample test cases
        test_cases = db.query(TestCase).filter(
            TestCase.problem_id == problem_id,
            TestCase.is_sample == True
        ).all()
    else:
        # Teachers/admins can see all test cases
        test_cases = db.query(TestCase).filter(
            TestCase.problem_id == problem_id
        ).all()
    
    return test_cases


@router.delete("/test-cases/{test_case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_test_case(
    test_case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a test case (teachers/admin only)."""
    if not current_user.is_teacher and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete test cases"
        )
    
    db_test_case = db.query(TestCase).filter(TestCase.id == test_case_id).first()
    if not db_test_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test case not found"
        )
    
    db.delete(db_test_case)
    db.commit()
    return None


# Submission endpoints
@router.post("/submissions", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
def create_submission(
    submission: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a solution to a problem."""
    # Verify the problem exists
    problem = db.query(Problem).filter(Problem.id == submission.problem_id).first()
    if not problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    
    # Create the submission object
    db_submission = Submission(
        **submission.dict(),
        user_id=current_user.id,
        status="pending"
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Here you would typically queue the code for execution/testing
    # For now, we'll just return the created submission
    
    return db_submission


@router.get("/submissions/{submission_id}", response_model=SubmissionResponse)
def get_submission(
    submission_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific submission by ID."""
    submission = db.query(Submission).filter(Submission.id == submission_id).first()
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    # Users can only see their own submissions unless they're teachers/admins
    if submission.user_id != current_user.id and not current_user.is_teacher and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this submission"
        )
    
    return submission


@router.get("/{problem_id}/submissions", response_model=List[SubmissionResponse])
def get_problem_submissions(
    problem_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get submissions for a problem."""
    # Regular users can only see their own submissions
    if not current_user.is_teacher and not current_user.is_admin:
        submissions = db.query(Submission).filter(
            Submission.problem_id == problem_id,
            Submission.user_id == current_user.id
        ).all()
    else:
        # Teachers/admins can see all submissions for a problem
        submissions = db.query(Submission).filter(
            Submission.problem_id == problem_id
        ).all()
    
    return submissions