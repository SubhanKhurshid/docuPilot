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
  const [currentCaseId, setCurrentCaseId] = useState<string | undefined>();
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);

  // Fetch user's chat history and current case
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          // Check localStorage for current case ID first
          const storedCaseId = localStorage.getItem('currentCaseId');
          if (storedCaseId) {
            setCurrentCaseId(storedCaseId);
            // Clear it after using it
            localStorage.removeItem('currentCaseId');
          }

          // Fetch chat history
          const chatResponse = await apiClient.getUserChats(user.id) as { chats: Array<{ id: string; title: string; timestamp: string }> };
          if (chatResponse.chats && chatResponse.chats.length > 0) {
            // Format the chat history with relative timestamps
            const formattedChats = chatResponse.chats.map((chat: { id: string; title: string; timestamp: string }) => ({
              id: chat.id,
              title: chat.title,
              timestamp: formatTimestamp(chat.timestamp)
            }));
            setChatHistory(formattedChats);
          }

          // Fetch user's cases to get the most recent one (if no stored case ID)
          if (!storedCaseId) {
            try {
              const casesResponse = await apiClient.getUserCases(user.id) as { cases: Array<{ id: string; created_at: string | null }> };
              if (casesResponse.cases && casesResponse.cases.length > 0) {
                // Get the most recent case if timestamps are available, otherwise get the first one
                const casesWithTimestamps = casesResponse.cases.filter(c => c.created_at);
                if (casesWithTimestamps.length > 0) {
                  const mostRecentCase = casesWithTimestamps.sort((a, b) => 
                    new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
                  )[0];
                  setCurrentCaseId(mostRecentCase.id);
                } else {
                  // Fallback to first case if no timestamps
                  setCurrentCaseId(casesResponse.cases[0].id);
                }
              }
            } catch (caseError) {
              console.error('Error fetching user cases:', caseError);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

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
    console.log('Case updated:', caseId, status);
    setCurrentCaseId(caseId);
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
              activeChatId={activeChatId}
              onNewChat={() => {
                setActiveChatId(undefined);
                setChatHistory(prev => [...prev]);
              }}
              onChatCreated={(chatId: string, title: string) => {
                setChatHistory(prev => [
                  { id: chatId, title, timestamp: 'Just now' },
                  ...prev
                ]);
              }}
            />
          ) : activeTab === 'documents' ? (
            <DashboardDocuments
              userId={user.id}
              currentCaseId={currentCaseId}
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