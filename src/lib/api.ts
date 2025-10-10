// API client for DocuPilot backend integration
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export interface ChatRequest {
  clerk_user_id: string;
  question: string;
  history?: Array<{ role: string; content: string }>;
  chat_id?: string;
  injury_name?: string;
}

export interface ChatResponse {
  response: string;
  chat_id: string;
  case_id?: string;
  case_status?: string;
  required_docs?: string[];
  completed_docs?: string[];
  is_new_case: boolean;
  case_information_completion?: number;
  next_questions?: any[];
}

export interface DocumentUploadRequest {
  case_id: string;
  document_name: string;
  document_content: string;
  document_type: string;
  document_data?: Record<string, any>;
}

export interface DocumentUploadResponse {
  message: string;
  document_id: string;
  ai_analysis: any;
}

export interface CaseDetails {
  case_id: string;
  injury_name: string;
  status: string;
  required_docs?: string[];
  completed_docs?: string[];
  progress_percentage: number;
  ai_analysis_summary?: {
    total_medical_costs: number;
    total_lost_wages: number;
    total_financial_impact: number;
    injury_details: any[];
    incident_summary: any;
    documents_analyzed: number;
  };
}

export interface SubscriptionRequest {
  clerk_user_id: string;
  email: string;
  base_url?: string;
}

export interface SubscriptionCheckRequest {
  clerk_user_id: string;
}

export interface SubscriptionCheckResponse {
  has_active_subscription: boolean;
  subscription_status?: string;
  subscription_id?: string;
  customer_id?: string;
  trial_days_left?: number;
  current_period_end?: string;
}

export interface PaymentIntentRequest {
  clerk_user_id: string;
  email: string;
  amount: number;
  currency: string;
}

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export interface CreateSubscriptionRecordRequest {
  clerk_user_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface CompleteSubscriptionRequest {
  clerk_user_id: string;
  setup_intent_id: string;
  price_id: string;
}

export interface LeadCaptureRequest {
  name: string;
  email: string;
  phone: string;
  claim_type: string;
  accident_date: string;
  has_injuries: boolean;
  injury_description?: string;
}

export interface LeadCaptureResponse {
  success: boolean;
  lead_id: string;
  message: string;
  claim_packet_ready: boolean;
  download_url: string;
}

export interface HomePageChatRequest {
  message: string;
  clerk_user_id: string;  // Required - no more session_id
  context?: {
    step?: number;
    claim_type?: string;
    action?: string;
    has_injuries?: boolean;
    accident_date?: string;
    question_index?: number;
    answers?: Record<string, string>;
    skip_to_completion?: boolean;
    lead_info?: {
      name?: string;
      email?: string;
      phone?: string;
    };
    conversation_history?: Array<{
      text: string;
      isUser: boolean;
    }>;
    [key: string]: any;
  };
}

export interface HomePageChatResponse {
  response: string;
  next_step: number;
  question_index?: number;
  total_questions?: number;
  answers?: Record<string, string>;
  completed?: boolean;
  category?: string;
  collected_info?: {
    claimType: string;
    location: string;
    accidentDate: string;
    name: string;
    email: string;
    phone: string;
  };
  subscription_required?: boolean;
  case_id?: string;
  buttons?: Array<{
    label: string;
    value: string;
  }>;
  show_date_picker?: boolean;
  show_input?: boolean;
}

export interface ConvertLeadToCaseRequest {
  lead_id: string;
  clerk_user_id: string;
}

export interface ConvertLeadToCaseResponse {
  success: boolean;
  case_id: string;
  chat_id: string;
  message: string;
  lead: {
    name: string;
    email: string;
    claim_type: string;
    accident_date: string;
  };
}

export interface ChatHistoryResponse {
  success: boolean;
  chats: Array<{
    chat_id: string;
    chat_title: string;
    created_at: string;
    messages: Array<{
      message_id: string;
      user_message: string;
      ai_response?: string;
      created_at: string;
    }>;
    case_info?: {
      case_id: string;
      injury: string;
      status: string;
    };
  }>;
}

export interface ResumeChatResponse {
  success: boolean;
  chat: {
    chat_id: string;
    chat_title: string;
    created_at: string;
    messages: Array<{
      message_id: string;
      user_message: string;
      ai_response?: string;
      created_at: string;
    }>;
    case_info?: {
      case_id: string;
      injury: string;
      status: string;
    };
  };
}

export interface GenerateClaimPacketFromCaseRequest {
  case_id: string;
  clerk_user_id: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Chat API
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Document API
  async uploadDocument(request: DocumentUploadRequest): Promise<DocumentUploadResponse> {
    return this.request<DocumentUploadResponse>('/api/upload-document', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async analyzeDocument(content: string, type: string, injury: string) {
    return this.request('/api/analyze-document', {
      method: 'POST',
      body: JSON.stringify({
        document_content: content,
        document_type: type,
        injury_name: injury,
      }),
    });
  }

  // Case API
  async getCaseDetails(caseId: string): Promise<CaseDetails> {
    return this.request<CaseDetails>(`/api/case/${caseId}`);
  }

  async getCaseDocuments(caseId: string) {
    return this.request(`/api/case/${caseId}/documents`);
  }

  async getUserCases(userId: string) {
    return this.request(`/api/user/${userId}/cases`);
  }

  // Subscription API
  async createSubscription(request: SubscriptionRequest) {
    return this.request('/api/create-subscription', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async completeSubscription(request: CompleteSubscriptionRequest) {
    return this.request('/api/complete-subscription', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async cancelSubscription(subscriptionId: string, userId: string) {
    return this.request('/api/cancel-subscription', {
      method: 'POST',
      body: JSON.stringify({
        subscription_id: subscriptionId,
        clerk_user_id: userId,
      }),
    });
  }

  async refreshSubscription(userId: string) {
    return this.request('/api/refresh-subscription', {
      method: 'POST',
      body: JSON.stringify({
        clerk_user_id: userId,
      }),
    });
  }

  // Subscription Check API
  async checkSubscription(request: SubscriptionCheckRequest): Promise<SubscriptionCheckResponse> {
    return this.request<SubscriptionCheckResponse>('/api/check-subscription', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getUserSubscriptionStatus(userId: string) {
    return this.request(`/api/user/${userId}/subscription-status`);
  }

  // Payment API
  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    return this.request<PaymentIntentResponse>('/api/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async createSubscriptionRecord(request: CreateSubscriptionRecordRequest) {
    return this.request('/api/create-subscription-record', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Chat History API
  async getUserChats(userId: string) {
    return this.request(`/api/user/${userId}/chats`);
  }

  async getChatMessages(chatId: string) {
    return this.request(`/api/chat/${chatId}/messages`);
  }

  // Homepage Chatbot API (no authentication required)
  async homePageChat(request: HomePageChatRequest): Promise<HomePageChatResponse> {
    return this.request<HomePageChatResponse>('/api/homepage-chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async captureLead(request: LeadCaptureRequest): Promise<LeadCaptureResponse> {
    return this.request<LeadCaptureResponse>('/api/capture-lead', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async downloadClaimPacket(leadId: string) {
    return this.request(`/api/download-claim-packet/${leadId}`);
  }

  // Lead Conversion API
  async convertLeadToCase(request: ConvertLeadToCaseRequest): Promise<ConvertLeadToCaseResponse> {
    return this.request<ConvertLeadToCaseResponse>('/api/convert-lead-to-case', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Chat History API
  async getUserChatHistory(userId: string): Promise<ChatHistoryResponse> {
    return this.request<ChatHistoryResponse>(`/api/user-chat-history/${userId}`);
  }

  async resumeChat(chatId: string, userId: string): Promise<ResumeChatResponse> {
    return this.request<ResumeChatResponse>(`/api/resume-chat/${chatId}`, {
      method: 'POST',
      body: JSON.stringify({ clerk_user_id: userId }),
    });
  }

  // Generate claim packet from case
  async generateClaimPacketFromCase(request: GenerateClaimPacketFromCaseRequest): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/api/generate-claim-packet-from-case`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient();
