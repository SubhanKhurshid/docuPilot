// API service for communicating with the DocuPilot backend
const API_BASE_URL = 'http://localhost:8000/api';

export interface ChatRequest {
  message: string;
  user_id: string;
  case_id?: string;
}

export interface ChatResponse {
  response: string;
  case_id: string;
  case_status: string;
  injury_type?: string;
  settlement_estimate?: {
    low_estimate: number;
    high_estimate: number;
    factors: string[];
    confidence: string;
  };
  demand_letter?: string;
}

export interface CaseDetails {
  accident_date?: string;
  accident_location?: string;
  accident_description?: string;
  current_symptoms?: string;
  treatments_received?: string[];
  medical_providers?: string[];
  work_impact?: string;
  pain_level?: number;
  medical_expenses?: number;
  lost_wages?: number;
}

export interface CreateCaseRequest {
  user_id: string;
  injury_type: string;
  case_details?: CaseDetails;
}

export interface CaseResponse {
  case_id: string;
  user_id: string;
  injury_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InjuryType {
  name: string;
  value: string;
  description: string;
}

export interface EmailRequest {
  case_id: string;
  email_type: 'demand_letter' | 'follow_up' | 'settlement_response' | 'client_update';
  recipient_email: string;
  cc_emails?: string[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Chat endpoints
  async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Case management endpoints
  async createCase(request: CreateCaseRequest): Promise<CaseResponse> {
    return this.request<CaseResponse>('/cases', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getCase(caseId: string): Promise<any> {
    return this.request<any>(`/cases/${caseId}`);
  }

  async getUserCases(userId: string): Promise<{ user_id: string; cases: any[]; count: number }> {
    return this.request<{ user_id: string; cases: any[]; count: number }>(`/cases/user/${userId}`);
  }

  async updateCaseStatus(caseId: string, status: string): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>(`/cases/${caseId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Injury information endpoints
  async getInjuryTypes(): Promise<{ injury_types: string[]; count: number }> {
    return this.request<{ injury_types: string[]; count: number }>('/injury-types');
  }

  async getInjuryInfo(injuryType: string): Promise<{
    injury_type: string;
    expected_documents: string[];
    expected_treatments: string[];
    average_settlement_range: [number, number];
    severity_factors: string[];
  }> {
    return this.request<any>(`/injury-info/${injuryType}`);
  }

  // Document management endpoints
  async uploadDocument(
    caseId: string,
    file: File,
    documentName: string,
    documentType: string,
    notes?: string
  ): Promise<{ message: string; document_id: string; document_name: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_name', documentName);
    formData.append('document_type', documentType);
    if (notes) {
      formData.append('notes', notes);
    }

    return this.request<any>(`/cases/${caseId}/documents`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async getCaseDocuments(caseId: string): Promise<{
    case_id: string;
    documents: any[];
    required_documents: string[];
    completion_percentage: number;
  }> {
    return this.request<any>(`/cases/${caseId}/documents`);
  }

  // Email endpoints
  async sendCaseEmail(caseId: string, request: EmailRequest): Promise<any> {
    return this.request<any>(`/cases/${caseId}/send-email`, {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Demand letter endpoints
  async generateDemandLetter(caseId: string): Promise<{
    message: string;
    demand_letter: string;
    settlement_demand: number;
  }> {
    return this.request<any>(`/cases/${caseId}/generate-demand-letter`, {
      method: 'POST',
    });
  }

  async getDemandLetter(caseId: string): Promise<{
    case_id: string;
    demand_letter: string;
    generated_at: string;
    response_deadline: string;
  }> {
    return this.request<any>(`/cases/${caseId}/demand-letter`);
  }

  // Analytics endpoints
  async getCaseAnalytics(userId?: string): Promise<any> {
    const url = userId ? `/analytics/cases?user_id=${userId}` : '/analytics/cases';
    return this.request<any>(url);
  }

  async getCasesNeedingAttention(): Promise<{
    cases_needing_attention: any[];
    count: number;
  }> {
    return this.request<any>('/analytics/cases/attention-needed');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request<any>('/health');
  }
}

export const apiService = new ApiService();
