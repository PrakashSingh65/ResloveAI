"""create_tickets_messages_knowledge_feedback_tables

Revision ID: a8c9e102f43d
Revises: 7ed6baf9ed8d
Create Date: 2026-11-10 19:25:00.000000

"""
from typing import Sequence, Union

from alembic import op
from pgvector.sqlalchemy import Vector
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = 'a8c9e102f43d'
down_revision: Union[str, Sequence[str], None] = '7ed6baf9ed8d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 0. Ensure vector extension is available in PostgreSQL
    op.execute("CREATE EXTENSION IF NOT EXISTS vector;")

    # 1. Tickets table
    op.create_table(
        'tickets',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('ticket_number', sa.String(length=50), nullable=False),
        sa.Column('customer_name', sqlmodel.sql.sqltypes.AutoString(length=150), nullable=False),
        sa.Column('customer_email', sa.String(length=255), nullable=False),
        sa.Column('customer_avatar', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('order_id', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=True),
        sa.Column('order_amount', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=True),
        sa.Column('channel', sa.Enum('WEB_CHAT', 'WHATSAPP', 'EMAIL', 'MOBILE_APP', name='channel'), nullable=False),
        sa.Column('status', sa.Enum('OPEN', 'AI_TROUBLESHOOTING', 'PENDING_USER', 'ESCALATED', 'RESOLVED', 'CLOSED', name='ticketstatus'), nullable=False),
        sa.Column('priority', sa.Enum('LOW', 'MEDIUM', 'HIGH', 'URGENT', name='ticketpriority'), nullable=False),
        sa.Column('intent', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=True),
        sa.Column('intent_confidence', sa.Float(), nullable=True),
        sa.Column('sentiment', sa.Enum('SATISFIED', 'NEUTRAL', 'URGENT', 'FRUSTRATED', name='customersentiment'), nullable=False),
        sa.Column('sentiment_score', sa.Float(), nullable=False),
        sa.Column('urgency_score', sa.Float(), nullable=False),
        sa.Column('assigned_agent_id', sa.Uuid(), nullable=True),
        sa.Column('assigned_agent_name', sqlmodel.sql.sqltypes.AutoString(length=150), nullable=True),
        sa.Column('resolution_action', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=True),
        sa.Column('escalated_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('resolved_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['assigned_agent_id'], ['users.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_tickets_ticket_number'), 'tickets', ['ticket_number'], unique=True)
    op.create_index(op.f('ix_tickets_customer_name'), 'tickets', ['customer_name'], unique=False)
    op.create_index(op.f('ix_tickets_customer_email'), 'tickets', ['customer_email'], unique=False)
    op.create_index(op.f('ix_tickets_status'), 'tickets', ['status'], unique=False)
    op.create_index(op.f('ix_tickets_priority'), 'tickets', ['priority'], unique=False)
    op.create_index(op.f('ix_tickets_created_at'), 'tickets', ['created_at'], unique=False)

    # 2. Messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('ticket_id', sa.Uuid(), nullable=False),
        sa.Column('sender', sa.Enum('CUSTOMER', 'AI', 'AGENT', 'SYSTEM', name='messagesender'), nullable=False),
        sa.Column('sender_name', sqlmodel.sql.sqltypes.AutoString(length=150), nullable=True),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('thoughts', sa.Text(), nullable=True),
        sa.Column('choices', sa.JSON(), nullable=True),
        sa.Column('suggested_replies', sa.JSON(), nullable=True),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('is_handoff_notice', sa.Boolean(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_messages_ticket_id'), 'messages', ['ticket_id'], unique=False)
    op.create_index(op.f('ix_messages_created_at'), 'messages', ['created_at'], unique=False)

    # 3. Diagnostic Steps table
    op.create_table(
        'diagnostic_steps',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('ticket_id', sa.Uuid(), nullable=False),
        sa.Column('step_number', sa.Integer(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('instruction', sa.Text(), nullable=False),
        sa.Column('status', sa.Enum('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', name='stepstatus'), nullable=False),
        sa.Column('result_note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_diagnostic_steps_ticket_id'), 'diagnostic_steps', ['ticket_id'], unique=False)

    # 4. AI Briefings table
    op.create_table(
        'ai_briefings',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('ticket_id', sa.Uuid(), nullable=False),
        sa.Column('core_issue', sa.Text(), nullable=False),
        sa.Column('root_cause', sa.Text(), nullable=False),
        sa.Column('attempted_steps', sa.JSON(), nullable=False),
        sa.Column('recommended_action', sa.Text(), nullable=False),
        sa.Column('recommended_action_label', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('confidence', sa.Float(), nullable=False),
        sa.Column('urgency_score', sa.Float(), nullable=False),
        sa.Column('sentiment_summary', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('ticket_id')
    )

    # 5. CSAT Feedbacks table
    op.create_table(
        'csat_feedbacks',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('ticket_id', sa.Uuid(), nullable=False),
        sa.Column('customer_name', sqlmodel.sql.sqltypes.AutoString(length=150), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('sentiment', sa.Enum('POSITIVE', 'NEUTRAL', 'NEGATIVE', name='feedbacksentiment'), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('ticket_id')
    )
    op.create_index(op.f('ix_csat_feedbacks_created_at'), 'csat_feedbacks', ['created_at'], unique=False)

    # 6. Knowledge Documents table
    op.create_table(
        'knowledge_documents',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('title', sqlmodel.sql.sqltypes.AutoString(length=255), nullable=False),
        sa.Column('category', sa.Enum('LOGISTICS', 'BILLING', 'PRODUCT', 'SECURITY', name='documentcategory'), nullable=False),
        sa.Column('doc_type', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('clause_number', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=True),
        sa.Column('source_url', sqlmodel.sql.sqltypes.AutoString(length=500), nullable=True),
        sa.Column('file_size', sqlmodel.sql.sqltypes.AutoString(length=50), nullable=True),
        sa.Column('tags', sa.JSON(), nullable=False),
        sa.Column('sample_snippet', sa.Text(), nullable=True),
        sa.Column('chunks_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_knowledge_documents_title'), 'knowledge_documents', ['title'], unique=False)

    # 7. Document Chunks table with Vector(768)
    op.create_table(
        'document_chunks',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('document_id', sa.Uuid(), nullable=False),
        sa.Column('chunk_index', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('metadata_json', sa.JSON(), nullable=True),
        sa.Column('embedding', Vector(768), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['document_id'], ['knowledge_documents.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_document_chunks_document_id'), 'document_chunks', ['document_id'], unique=False)

    # 8. Conversation Evals table
    op.create_table(
        'conversation_evals',
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column('ticket_id', sa.Uuid(), nullable=False),
        sa.Column('turn_index', sa.Integer(), nullable=False),
        sa.Column('context_relevance', sa.Float(), nullable=True),
        sa.Column('groundedness', sa.Float(), nullable=True),
        sa.Column('answer_relevance', sa.Float(), nullable=True),
        sa.Column('toxicity_score', sa.Float(), nullable=True),
        sa.Column('latency_ms', sa.Integer(), nullable=True),
        sa.Column('model_used', sqlmodel.sql.sqltypes.AutoString(length=100), nullable=False),
        sa.Column('eval_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['ticket_id'], ['tickets.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_conversation_evals_ticket_id'), 'conversation_evals', ['ticket_id'], unique=False)


def downgrade() -> None:
    op.drop_table('conversation_evals')
    op.drop_table('document_chunks')
    op.drop_table('knowledge_documents')
    op.drop_table('csat_feedbacks')
    op.drop_table('ai_briefings')
    op.drop_table('diagnostic_steps')
    op.drop_table('messages')
    op.drop_table('tickets')
