"""add_nodes_to_skill_trees

Revision ID: a3246bd07fd5
Revises: eb8af9918af6
Create Date: 2025-04-19 17:32:02.537273

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "a3246bd07fd5"
down_revision: Union[str, None] = "eb8af9918af6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add nodes column with JSON type to skill_trees table
    op.add_column("skill_trees", sa.Column("nodes", postgresql.JSONB(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    # Remove nodes column
    op.drop_column("skill_trees", "nodes")
