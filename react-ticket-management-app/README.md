# TicketFlex - Multi-Framework Ticket Management System

A comprehensive ticket management application built with multiple frontend frameworks, featuring a modern React implementation with TypeScript, Vite, and a complete UI component library.

## 🚀 Project Overview

TicketFlex is a full-featured ticket management system designed for modern teams to efficiently track, manage, and resolve customer support issues. The application provides a clean, intuitive interface for creating, updating, and monitoring tickets with real-time status tracking.

### Key Features

- **🔐 Authentication System**: Secure login/signup with session management
- **📊 Dashboard Analytics**: Real-time statistics and ticket overview
- **🎫 Ticket Management**: Full CRUD operations for tickets
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🎨 Modern UI**: Shadcn/ui components with Radix UI primitives
- **⚡ Fast Development**: Vite build system with HMR
- **🛠️ Type Safety**: Full TypeScript implementation
- **📦 Modular Architecture**: Well-organized component structure

## 🏗️ Architecture

### Technology Stack

**Frontend Framework:**
- React 19.1.1 with TypeScript
- Vite 7.1.7 for build tooling
- React Router DOM for navigation

**UI & Styling:**
- Tailwind CSS 4.1.16 for styling
- Shadcn/ui component library
- Radix UI primitives for accessibility
- Lucide React for icons

**State & Data Management:**
- JSON Server for mock API
- Local storage for session management
- React hooks for state management

**Development Tools:**
- ESLint for code quality
- TypeScript for type checking
- Concurrently for running multiple dev servers

### Project Structure

```
react-ticket-management-app/
├── public/                 # Static assets
│   ├── ico.png            # Favicon
│   └── vite.svg           # Vite logo
├── src/
│   ├── assets/            # Imported assets (logos, icons)
│   ├── components/        # Reusable UI components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── ui/           # Shadcn/ui components
│   │   ├── dashboard/    # Dashboard-specific components
│   │   └── tickets/      # Ticket-related components
│   ├── lib/              # Utility functions and services
│   │   ├── auth.ts       # Authentication logic
│   │   ├── mockApi.ts    # API service layer
│   │   ├── types.ts      # TypeScript type definitions
│   │   └── utils/        # Helper functions
│   ├── pages/            # Page components
│   │   ├── Landing.tsx   # Landing/Home page
│   │   ├── Login.tsx     # Authentication page
│   │   ├── Signup.tsx    # Registration page
│   │   ├── Dashboard.tsx # Main dashboard
│   │   └── TicketManagement.tsx # Ticket CRUD interface
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── db.json               # Mock database (JSON Server)
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── README.md             # This documentation
```

## 📋 Prerequisites

- **Node.js**: v18+ recommended
- **npm**: Bundled with Node.js
- **Git**: For version control

## 🚀 Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd multi-framework-ticket-app/react-ticket-management-app

# Install dependencies
npm install

# If you encounter peer dependency issues
npm install --legacy-peer-deps
```

### 2. Start Development Environment

The project uses concurrently to run both the frontend and mock API server:

```bash
# Start both Vite dev server and JSON Server
npm run dev
```

This command starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **API Server**: http://localhost:3001 (JSON Server)

### 3. Alternative Commands

```bash
# Run only the frontend
npm run dev

# Run only the API server
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🔐 Authentication

### Demo Account

Use these credentials for quick access:

- **Email**: `demo@ticketapp.com`
- **Password**: `demo123`

### Authentication Flow

1. **Login/Signup**: Users can authenticate via `/auth/login` or `/auth/signup`
2. **Session Management**: Tokens stored in localStorage with 24-hour expiry
3. **Protected Routes**: Dashboard and ticket management require authentication
4. **Auto-redirect**: Authenticated users redirected from auth pages to dashboard

### Token Structure

```json
{
  "token": "<random-string>",
  "expiresAt": "2025-10-26T15:35:25.844Z",
  "user": {
    "id": "demo",
    "email": "demo@ticketapp.com",
    "name": "Demo User"
  }
}
```

## 📊 Features & Functionality

### Dashboard
- **Statistics Overview**: Total tickets, open tickets, in-progress, closed
- **Quick Actions**: Direct access to create new tickets
- **Recent Activity**: Latest ticket updates
- **Visual Analytics**: Charts and progress indicators

### Ticket Management
- **Create Tickets**: Form-based ticket creation with validation
- **View Tickets**: List view with filtering and search
- **Update Status**: Change ticket status (open → in_progress → closed)
- **Edit Tickets**: Modify ticket details
- **Delete Tickets**: Remove tickets with confirmation
- **Priority Levels**: High, medium, low priority classification

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode Ready**: CSS variables for theme switching
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Skeleton loaders and progress indicators
- **Error Handling**: User-friendly error messages

## 🛠️ API Integration

### Mock API Layer (`src/lib/mockApi.ts`)

The application uses a mock API layer that simulates real backend interactions:

```typescript
// Example API calls
apiGetTickets()      // GET /tickets
apiCreateTicket(data) // POST /tickets
apiUpdateTicket(id, data) // PATCH /tickets/:id
apiDeleteTicket(id)  // DELETE /tickets/:id
apiLogin(credentials) // POST /auth/login
```

### JSON Server Endpoints

- `GET /tickets` - Fetch all tickets
- `GET /tickets?userId=<id>` - Filter tickets by user
- `POST /tickets` - Create new ticket
- `PATCH /tickets/:id` - Update ticket
- `DELETE /tickets/:id` - Delete ticket
- `POST /auth/login` - User authentication

## 🎨 UI Components

### Shadcn/ui Components Used

- **Button**: Action buttons with variants
- **Card**: Content containers
- **Dialog**: Modals and forms
- **Input**: Form inputs
- **Select**: Dropdown selections
- **Table**: Data display
- **Badge**: Status indicators
- **Alert Dialog**: Confirmations
- **Toast**: Notifications

### Custom Components

- **Header**: Navigation and branding
- **Footer**: Site information and links
- **StatCard**: Dashboard statistics
- **TicketCard**: Ticket list items
- **TicketForm**: Create/edit ticket forms

## 🔧 Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
# API Base URL (defaults to localhost:3001)
VITE_API_BASE_URL=http://localhost:3001

# App Title
VITE_APP_TITLE=TicketFlex
```

### Vite Configuration (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
})
```

## 🧪 Testing & Quality

### Code Quality

- **ESLint**: Configured for React and TypeScript
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (can be added)

### Development Workflow

1. **Hot Module Replacement**: Instant updates during development
2. **Type Checking**: Real-time TypeScript errors
3. **Linting**: Automatic code quality checks
4. **Build Optimization**: Tree shaking and minification

## 🚀 Deployment

### Production Build

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Checklist

- [ ] Update API endpoints for production
- [ ] Configure environment variables
- [ ] Set up proper authentication backend
- [ ] Configure domain and SSL
- [ ] Set up monitoring and logging
- [ ] Test all features in production environment

## 🐛 Troubleshooting

### Common Issues

**Authentication Problems:**
- Clear localStorage: `localStorage.clear()`
- Check if JSON Server is running: http://localhost:3001/users
- Verify demo user exists in `db.json`

**API Connection Issues:**
- Ensure JSON Server is running on port 3001
- Check network tab for failed requests
- Verify CORS settings if using external API

**Build Errors:**
- Run `npm run lint` to check for code issues
- Ensure all dependencies are installed
- Check TypeScript errors with `npm run build`

**Styling Issues:**
- Verify Tailwind CSS is properly configured
- Check for CSS class conflicts
- Ensure custom CSS variables are defined

## 📈 Future Enhancements

### Planned Features

- [ ] Real-time notifications with WebSockets
- [ ] Advanced filtering and search
- [ ] Ticket assignment to team members
- [ ] File attachments for tickets
- [ ] Email notifications
- [ ] Role-based access control
- [ ] Audit logs and activity tracking
- [ ] API rate limiting
- [ ] Multi-language support (i18n)

### Technical Improvements

- [ ] Replace JSON Server with Express.js backend
- [ ] Add comprehensive test suite (Jest + React Testing Library)
- [ ] Implement state management (Zustand/Redux)
- [ ] Add error boundary components
- [ ] Implement progressive web app (PWA) features
- [ ] Add performance monitoring
- [ ] Implement caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Maintain consistent code style
- Add proper error handling
- Write clear commit messages
- Test changes thoroughly

## 📄 License

This project is not licensed

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Shadcn** for the beautiful UI components
- **Tailwind CSS** for the utility-first styling approach
- **Radix UI** for accessible component primitives
- **Vite** for the lightning-fast build tool

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**
