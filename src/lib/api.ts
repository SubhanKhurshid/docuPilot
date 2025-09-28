// API client for DocuPilot backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
  required_docs: string[];
  completed_docs: string[];
  progress_percentage: number;
  ai_analysis_summary: {
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
}

export const apiClient = new ApiClient();
