"""create_problem_tables

Revision ID: d4f8a2c16b39
Revises: a3246bd07fd5
Create Date: 2025-05-08 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "d4f8a2c16b39"
down_revision: Union[str, None] = "a3246bd07fd5"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema to add problem, test_case, and submission tables."""
    # Create problems table
    op.create_table(
        "problems",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("title", sa.String(), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("difficulty", sa.String(), nullable=True),
        sa.Column("time_limit", sa.Integer(), nullable=True),
        sa.Column("memory_limit", sa.Integer(), nullable=True),
        sa.Column("problem_ref_id", sa.String(), nullable=True),
        sa.Column("input_format", sa.Text(), nullable=True),
        sa.Column("output_format", sa.Text(), nullable=True),
        sa.Column("constraints", sa.Text(), nullable=True),
        sa.Column("starter_code", postgresql.JSONB(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.Column("created_by", sa.String(), nullable=True),
        sa.ForeignKeyConstraint(["created_by"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("problem_ref_id")
    )
    
    # Create test_cases table
    op.create_table(
        "test_cases",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("problem_id", sa.String(), nullable=False),
        sa.Column("input_data", sa.Text(), nullable=False),
        sa.Column("expected_output", sa.Text(), nullable=False),
        sa.Column("is_sample", sa.Boolean(), nullable=True),
        sa.Column("weight", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["problem_id"], ["problems.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id")
    )
    
    # Create submissions table
    op.create_table(
        "submissions",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("problem_id", sa.String(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("code", sa.Text(), nullable=False),
        sa.Column("language", sa.String(), nullable=False),
        sa.Column("block_structure", postgresql.JSONB(), nullable=True),
        sa.Column("status", sa.String(), nullable=True),
        sa.Column("score", sa.Integer(), nullable=True),
        sa.Column("execution_time", sa.Integer(), nullable=True),
        sa.Column("memory_used", sa.Integer(), nullable=True),
        sa.Column("test_results", postgresql.JSONB(), nullable=True),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=True),
        sa.ForeignKeyConstraint(["problem_id"], ["problems.id"], ),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ),
        sa.PrimaryKeyConstraint("id")
    )


def downgrade() -> None:
    """Downgrade schema by removing problem, test_case, and submission tables."""
    op.drop_table("submissions")
    op.drop_table("test_cases")
    op.drop_table("problems")