# DocuPilot Frontend

Modern React frontend for the DocuPilot AI personal injury settlement platform.

## Features

- **Modern Dashboard** - Clean white-background interface with collapsible sidebar
- **AI Chat Integration** - Real-time chat with backend AI assistant
- **Case Management** - Track personal injury cases with progress indicators
- **Document Upload** - Drag-and-drop document upload with AI analysis
- **Subscription Flow** - Stripe-powered subscription management
- **Authentication** - User authentication and session management
- **Responsive Design** - Mobile-first responsive design

## Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

## Architecture

- **Frontend** - React SPA that communicates with backend API
- **Backend** - FastAPI server handling all business logic
- **Stripe Integration** - Handled entirely by backend
- **Clerk Authentication** - Handled entirely by backend
- **AI Processing** - Backend AI integration with Groq/Llama

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardChat.tsx
│   ├── DashboardMain.tsx
│   ├── DashboardSidebar.tsx
│   └── SubscriptionFlow.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── SubscriptionContext.tsx
├── lib/               # Utility libraries
│   └── api.ts         # Backend API client
├── pages/             # Page components
│   ├── Dashboard.tsx
│   ├── HomePage.tsx
│   ├── Pricing.tsx
│   └── ...
└── App.tsx            # Main app component
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on localhost:8000

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:8000

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

## Key Components

### Dashboard
- **Modern Layout** - Clean white background with professional sidebar
- **Collapsible Sidebar** - Space-efficient navigation
- **Tab-based Navigation** - Dashboard, Chat, Cases, Documents, Analytics
- **Chat History** - Persistent chat history in sidebar

### Chat System
- **Real-time AI Chat** - Direct integration with backend AI
- **Message History** - Persistent conversation history
- **File Upload** - Document upload with AI analysis
- **Case Integration** - Automatic case creation and updates
- **Typing Indicators** - Real-time typing feedback

### Case Management
- **Progress Tracking** - Visual progress indicators
- **Document Status** - Track required vs completed documents
- **Financial Summary** - AI-calculated settlement values
- **Status Updates** - Real-time case status changes

### Subscription Flow
- **Stripe Integration** - Secure payment processing
- **Trial Management** - 7-day free trial
- **Step-by-step Setup** - Guided subscription process
- **Payment Security** - PCI-compliant payment handling

## API Integration

The frontend integrates with the DocuPilot backend API:

### Chat Endpoints
- `POST /chat` - Send messages to AI assistant
- `POST /upload-document` - Upload and analyze documents
- `GET /case/{id}` - Get case details
- `GET /user/{id}/cases` - Get user's cases

### Subscription Endpoints
- `POST /create-subscription` - Create subscription setup
- `POST /complete-subscription` - Complete subscription
- `POST /cancel-subscription` - Cancel subscription
- `POST /refresh-subscription` - Refresh subscription status

## User Flow

1. **Landing Page** - User visits homepage
2. **Sign Up** - User creates account
3. **Pricing** - User views pricing and starts subscription
4. **Subscription Flow** - Stripe-powered subscription setup
5. **Dashboard** - User accesses modern dashboard
6. **AI Chat** - User interacts with AI assistant
7. **Case Creation** - AI creates case based on conversation
8. **Document Upload** - User uploads documents for analysis
9. **Progress Tracking** - User tracks case progress
10. **Demand Letter** - AI generates demand letter when ready

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Code Structure

- **Components** - Reusable UI components with TypeScript
- **Contexts** - Global state management
- **API Client** - Centralized backend communication
- **Pages** - Route-based page components
- **Styling** - Tailwind CSS with custom components

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Configuration

Set the following environment variables in production:

- `VITE_API_BASE_URL` - Backend API URL

**Note:** Stripe and Clerk are handled entirely by the backend, so no frontend environment variables are needed for these services.

## Features Overview

### Dashboard Features
- ✅ Modern white-background design
- ✅ Collapsible sidebar navigation
- ✅ Real-time chat integration
- ✅ Case management and tracking
- ✅ Document upload and analysis
- ✅ Progress indicators
- ✅ Financial summaries

### Chat Features
- ✅ AI-powered conversations
- ✅ Document upload support
- ✅ Case creation automation
- ✅ Message history
- ✅ Typing indicators
- ✅ File type support

### Subscription Features
- ✅ Stripe payment integration
- ✅ Free trial management
- ✅ Step-by-step setup
- ✅ Secure payment processing
- ✅ Subscription status tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - DocuPilot Platform