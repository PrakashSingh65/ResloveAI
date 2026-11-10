import { apiClient, API_ROUTES } from "./axios"
import { Ticket, Message } from "@/components/dashboard/types"

export interface TicketMetrics {
  total_tickets: number
  open_tickets: number
  escalated_tickets: number
  resolved_tickets: number
  ai_resolution_rate: number
  avg_csat_score: number
  avg_handle_time_minutes: number
}

export interface ListTicketsParams {
  status?: string
  priority?: string
  channel?: string
  search?: string
  limit?: number
  offset?: number
}

export interface SendMessagePayload {
  text: string
  sender?: "customer" | "agent" | "ai"
  sender_name?: string
  choices?: string[]
  suggested_replies?: string[]
}

export interface ResolveTicketPayload {
  action_name: string
  notes?: string
}

export interface CSATPayload {
  rating: number
  sentiment?: "Positive" | "Neutral" | "Negative"
  comment?: string
  customer_name?: string
}

export interface RAGCitationResult {
  doc_id: string
  doc_name: string
  doc_type: string
  clause_number?: string
  similarity_score: number
  snippet: string
  source_url?: string
}

export interface RAGQueryResponse {
  query: string
  citations: RAGCitationResult[]
  retrieval_latency_ms: number
}

export const ticketsApi = {
  // 1. Fetch support desk aggregate metrics
  async getMetrics(): Promise<TicketMetrics> {
    const res = await apiClient.get<TicketMetrics>(API_ROUTES.TICKETS.METRICS)
    return res.data
  },

  // 2. List tickets with filters
  async listTickets(params?: ListTicketsParams): Promise<Ticket[]> {
    const res = await apiClient.get<Ticket[]>(API_ROUTES.TICKETS.LIST, { params })
    return res.data
  },

  // 3. Get single ticket with full relations
  async getTicket(ticketId: string): Promise<Ticket> {
    const res = await apiClient.get<Ticket>(API_ROUTES.TICKETS.DETAIL(ticketId))
    return res.data
  },

  // 4. Send message to conversation
  async sendMessage(ticketId: string, payload: SendMessagePayload): Promise<Message> {
    const res = await apiClient.post<Message>(API_ROUTES.TICKETS.MESSAGES(ticketId), payload)
    return res.data
  },

  // 5. Execute 1-click resolution action
  async resolveTicket(ticketId: string, payload: ResolveTicketPayload): Promise<Ticket> {
    const res = await apiClient.post<Ticket>(API_ROUTES.TICKETS.RESOLVE(ticketId), payload)
    return res.data
  },

  // 6. Submit CSAT feedback
  async submitFeedback(ticketId: string, payload: CSATPayload): Promise<any> {
    const res = await apiClient.post(API_ROUTES.TICKETS.FEEDBACK(ticketId), payload)
    return res.data
  },

  // 7. Seed sample tickets on first setup
  async seedSampleTickets(): Promise<{ message: string; seeded: number }> {
    const res = await apiClient.post(API_ROUTES.TICKETS.SEED)
    return res.data
  },

  // 8. Query RAG Knowledge Base
  async queryKnowledge(query: string, top_k: number = 3): Promise<RAGQueryResponse> {
    const res = await apiClient.post<RAGQueryResponse>(API_ROUTES.KNOWLEDGE.QUERY, {
      query,
      top_k,
    })
    return res.data
  },

  // 9. Seed default knowledge documents
  async seedKnowledge(): Promise<{ message: string; documents_added: number }> {
    const res = await apiClient.post(API_ROUTES.KNOWLEDGE.SEED)
    return res.data
  },
}
