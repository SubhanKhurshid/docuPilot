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
  session_id?: string;
}

export interface LeadCaptureResponse {
  success: boolean;
  lead_id: string;
  message: string;
  session_id?: string;
  claim_packet_ready?: boolean;
  download_url?: string;
}

export interface SaveCaseRequest {
  clerk_user_id: string;
  lead_info: {
    name: string;
    email: string;
    phone: string;
  };
  claim_type: string;
  accident_date: string;
  has_injuries: boolean;
  answers: Record<string, string>;
  session_id: string;
}

export interface SaveCaseResponse {
  success: boolean;
  case_id: string;
  message: string;
  answers_saved: number;
  questions_asked: string[];
}

export interface GenerateDocumentRequest {
  case_id: string;
  document_type: 'claim_packet' | 'demand_letter';
  clerk_user_id: string;
}

export interface DocumentResponse {
  success: boolean;
  document_id: string;
  document_name: string;
  document_type: string;
  download_url: string;
  message: string;
}

export interface CaseDocument {
  document_id: string;
  document_name: string;
  document_type: string;
  generated_date: string;
  file_size: number;
  status: string;
}

export interface CaseDocumentsResponse {
  success: boolean;
  case_id: string;
  documents: CaseDocument[];
  total_documents: number;
}

export interface HomePageChatRequest {
  message: string;
  session_id?: string;
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

export interface ButtonOption {
  label: string;
  value: string;
  icon?: string;
}

export interface HomePageChatResponse {
  response: string;
  session_id: string;
  next_step: number;
  question_index?: number;
  total_questions?: number;
  answers?: Record<string, string>;
  completed?: boolean;
  category?: string;
  has_injuries?: boolean;
  injury_description?: string;
  buttons?: ButtonOption[];
  show_input?: boolean;
  show_date_picker?: boolean;
  show_download?: boolean;
  email_sent?: boolean;
  lead_id?: string;
  require_signup?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private maxRetries: number = 2;
  private retryDelay: number = 1000; // 1 second

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.detail || `HTTP error! status: ${response.status}`;
        
        // Retry on 5xx server errors or network issues
        if (response.status >= 500 && retryCount < this.maxRetries) {
          console.warn(`Request failed with status ${response.status}, retrying... (${retryCount + 1}/${this.maxRetries})`);
          await this.sleep(this.retryDelay * (retryCount + 1)); // Exponential backoff
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors (no response from server)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (retryCount < this.maxRetries) {
          console.warn(`Network error, retrying... (${retryCount + 1}/${this.maxRetries})`);
          await this.sleep(this.retryDelay * (retryCount + 1));
          return this.request<T>(endpoint, options, retryCount + 1);
        }
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw error;
    }
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


  async getUserCases(userId: string) {
    return this.request(`/api/user-cases/${userId}`);
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

  async saveCase(request: SaveCaseRequest): Promise<SaveCaseResponse> {
    return this.request<SaveCaseResponse>('/api/save-case', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateDocument(request: GenerateDocumentRequest): Promise<DocumentResponse> {
    return this.request<DocumentResponse>('/api/generate-document', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCaseDocuments(caseId: string, clerkUserId: string): Promise<CaseDocumentsResponse> {
    return this.request<CaseDocumentsResponse>(`/api/case-documents/${caseId}?clerk_user_id=${clerkUserId}`);
  }

  async autoGenerateDocuments(caseId: string, clerkUserId: string): Promise<{ success: boolean; case_id: string; generated_documents: DocumentResponse[]; message: string }> {
    return this.request(`/api/auto-generate-documents?case_id=${caseId}&clerk_user_id=${clerkUserId}`, {
      method: 'POST',
    });
  }

  async downloadClaimPacket(leadId: string) {
    return this.request(`/api/download-claim-packet/${leadId}`);
  }
}

export const apiClient = new ApiClient();
