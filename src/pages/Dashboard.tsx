import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../lib/api';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardMain from '../components/DashboardMain';
import DashboardChat from '../components/DashboardChat';
import DashboardDocuments from '../components/DashboardDocuments';
import DashboardAnalytics from '../components/DashboardAnalytics';
import DashboardSubscription from '../components/DashboardSubscription';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string; timestamp: string }>>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>();
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  // Mock chat history - in real app, this would come from API
  useEffect(() => {
    setChatHistory([
      { id: 'chat1', title: 'Car accident injury case', timestamp: '2 hours ago' },
      { id: 'chat2', title: 'Workplace injury consultation', timestamp: '1 day ago' },
      { id: 'chat3', title: 'Slip and fall case', timestamp: '3 days ago' },
    ]);
  }, []);

  // Check subscription status
  useEffect(() => {
    const checkSubscription = async () => {
      if (user) {
        try {
          const response = await apiClient.checkSubscription({
            clerk_user_id: user.id
          });
          setHasSubscription(response.has_active_subscription);
        } catch (error) {
          console.error('Error checking subscription:', error);
          setHasSubscription(false);
        } finally {
          setIsCheckingSubscription(false);
        }
      }
    };

    // Check if user just completed payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // Refresh subscription status after successful payment
      setTimeout(() => {
        checkSubscription();
      }, 2000); // Wait 2 seconds for webhook to process
    } else {
      checkSubscription();
    }
  }, [user]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setActiveTab('chat');
  };

  const handleCaseUpdate = (caseId: string, status: string) => {
    setCurrentCaseId(caseId);
    console.log('Case updated:', caseId, status);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please sign in</h2>
          <p className="text-gray-300">You need to be signed in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  if (isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8dff2d] mx-auto mb-4"></div>
          <p className="text-gray-300">Checking subscription status...</p>
        </div>
      </div>
    );
  }

  if (!hasSubscription) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Subscription Required</h2>
          <p className="text-gray-300 mb-6">
            You need an active subscription to access the dashboard. Please complete your payment to continue.
          </p>
          <button
            onClick={() => window.location.href = '/pricing'}
            className="px-6 py-3 bg-[#8dff2d] text-black rounded-lg hover:bg-[#7be525] transition-colors font-semibold"
          >
            Go to Pricing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
          chatHistory={chatHistory}
          onChatSelect={handleChatSelect}
          activeChatId={activeChatId}
        />
        
        <div className="flex-1 flex flex-col bg-black">
          {activeTab === 'chat' ? (
            <DashboardChat
              userId={user.id}
              onCaseUpdate={handleCaseUpdate}
            />
          ) : activeTab === 'documents' ? (
            <DashboardDocuments
              userId={user.id}
            />
          ) : activeTab === 'analytics' ? (
            <DashboardAnalytics
              userId={user.id}
            />
          ) : activeTab === 'subscription' ? (
            <DashboardSubscription
              userId={user.id}
            />
          ) : (
            <DashboardMain
              userId={user.id}
              onCaseUpdate={handleCaseUpdate}
            />
          )}
        </div>
      </div>
  );
};

export default Dashboard;