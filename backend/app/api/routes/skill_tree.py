from fastapi import APIRouter, Depends, HTTPException, status, Response
from typing import List
from sqlalchemy.orm import Session
import uuid

from app.core.config import settings
from app.db.database import get_db
from app.models.skill_tree import SkillTree
from app.schemas.skill_tree import SkillTreeCreate, SkillTreeResponse
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.get("/", response_model=List[SkillTreeResponse])
async def list_skill_trees(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """
    List all skill trees
    """
    skill_trees = db.query(SkillTree).all()
    return skill_trees


@router.post("/", response_model=SkillTreeResponse)
async def create_skill_tree(
    skill_tree_in: SkillTreeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create a new skill tree
    """
    # Only teachers can create skill trees
    if not current_user.is_teacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can create skill trees"
        )
        
    # Create a new skill tree with a UUID
    skill_tree = SkillTree(
        id=f"ST{uuid.uuid4().hex[:8].upper()}",  # Generate a custom ID like ST12345678
        title=skill_tree_in.title,
        description=skill_tree_in.description,
        guide=skill_tree_in.guide,
        bg_color=skill_tree_in.bg_color or "#3498db",
    )

    db.add(skill_tree)
    db.commit()
    db.refresh(skill_tree)

    return skill_tree


@router.get("/{skill_tree_id}", response_model=SkillTreeResponse)
async def get_skill_tree(
    skill_tree_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get a specific skill tree by ID
    """
    skill_tree = db.query(SkillTree).filter(SkillTree.id == skill_tree_id).first()
    if not skill_tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill tree with ID {skill_tree_id} not found",
        )

    return skill_tree


@router.put("/{skill_tree_id}", response_model=SkillTreeResponse)
async def update_skill_tree(
    skill_tree_id: str,
    skill_tree_in: SkillTreeCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update a skill tree
    """
    # Only teachers can update skill trees
    if not current_user.is_teacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can update skill trees"
        )
        
    skill_tree = db.query(SkillTree).filter(SkillTree.id == skill_tree_id).first()
    if not skill_tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill tree with ID {skill_tree_id} not found",
        )

    # Update skill tree fields
    skill_tree.title = skill_tree_in.title
    skill_tree.description = skill_tree_in.description
    skill_tree.guide = skill_tree_in.guide
    skill_tree.bg_color = skill_tree_in.bg_color or skill_tree.bg_color

    # Update nodes if they are provided
    if skill_tree_in.nodes is not None:
        skill_tree.nodes = skill_tree_in.nodes

    db.commit()
    db.refresh(skill_tree)

    return skill_tree


@router.delete("/{skill_tree_id}")
async def delete_skill_tree(
    skill_tree_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Delete a skill tree
    """
    # Only teachers can delete skill trees
    if not current_user.is_teacher:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can delete skill trees"
        )
        
    skill_tree = db.query(SkillTree).filter(SkillTree.id == skill_tree_id).first()
    if not skill_tree:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Skill tree with ID {skill_tree_id} not found",
        )

    db.delete(skill_tree)
    db.commit()

    return {"message": f"Skill tree {skill_tree_id} deleted successfully"}
