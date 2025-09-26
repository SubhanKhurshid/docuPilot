import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { apiService, ChatRequest, ChatResponse, CaseResponse, CreateCaseRequest } from '../services/api';

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  caseId?: string;
  caseStatus?: string;
  injuryType?: string;
  settlementEstimate?: {
    low_estimate: number;
    high_estimate: number;
    factors: string[];
    confidence: string;
  };
  demandLetter?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  currentCaseId?: string;
  currentUserId: string;
  isTyping: boolean;
  caseStatus: string;
  injuryType?: string;
  settlementEstimate?: {
    low_estimate: number;
    high_estimate: number;
    factors: string[];
    confidence: string;
  };
  demandLetter?: string;
}

interface ChatContextType {
  state: ChatState;
  sendMessage: (message: string) => Promise<void>;
  createCase: (injuryType: string, caseDetails?: any) => Promise<void>;
  resetChat: () => void;
  setUserId: (userId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [state, setState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        text: "Hello! I'm DocuPilot AI. I can help you maximize your personal injury settlement. What type of injury have you sustained?",
        isUser: false,
        timestamp: new Date(),
      },
    ],
    currentCaseId: undefined,
    currentUserId: 'user_' + Date.now(), // Generate a temporary user ID
    isTyping: false,
    caseStatus: 'initial',
  });

  const setUserId = useCallback((userId: string) => {
    setState(prev => ({ ...prev, currentUserId: userId }));
  }, []);

  const resetChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [
        {
          id: '1',
          text: "Hello! I'm DocuPilot AI. I can help you maximize your personal injury settlement. What type of injury have you sustained?",
          isUser: false,
          timestamp: new Date(),
        },
      ],
      currentCaseId: undefined,
      isTyping: false,
      caseStatus: 'initial',
      injuryType: undefined,
      settlementEstimate: undefined,
      demandLetter: undefined,
    }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;

    // Add user message to state
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
      caseId: state.currentCaseId,
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true,
    }));

    try {
      // Send message to backend
      const request: ChatRequest = {
        message,
        user_id: state.currentUserId,
        case_id: state.currentCaseId,
      };

      const response: ChatResponse = await apiService.sendChatMessage(request);

      // Add AI response to state
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        caseId: response.case_id,
        caseStatus: response.case_status,
        injuryType: response.injury_type,
        settlementEstimate: response.settlement_estimate,
        demandLetter: response.demand_letter,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false,
        currentCaseId: response.case_id,
        caseStatus: response.case_status,
        injuryType: response.injury_type,
        settlementEstimate: response.settlement_estimate,
        demandLetter: response.demand_letter,
      }));

      // If a new case was created, trigger a page refresh to update the dashboard
      if (response.case_id && response.case_id !== state.currentCaseId) {
        // Dispatch a custom event to notify the dashboard
        window.dispatchEvent(new CustomEvent('caseCreated', { 
          detail: { caseId: response.case_id, injuryType: response.injury_type } 
        }));
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error processing your message. Please try again or contact support if the issue persists.",
        isUser: false,
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isTyping: false,
      }));
    }
  }, [state.currentUserId, state.currentCaseId]);

  const createCase = useCallback(async (injuryType: string, caseDetails?: any) => {
    try {
      const request: CreateCaseRequest = {
        user_id: state.currentUserId,
        injury_type: injuryType,
        case_details: caseDetails,
      };

      const response: CaseResponse = await apiService.createCase(request);
      
      setState(prev => ({
        ...prev,
        currentCaseId: response.case_id,
        caseStatus: response.status,
        injuryType: response.injury_type,
      }));

    } catch (error) {
      console.error('Failed to create case:', error);
      throw error;
    }
  }, [state.currentUserId]);

  const value: ChatContextType = {
    state,
    sendMessage,
    createCase,
    resetChat,
    setUserId,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
