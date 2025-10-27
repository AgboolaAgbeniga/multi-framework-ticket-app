# TicketFlex - React Implementation

A modern ticket management application built with React 18, TypeScript, and Vite. This is one of three implementations (React/Vue/Twig) showcasing the same functionality across different web frameworks.

## 🌐 Live Demo

**[Try the React Implementation](https://react-ticket-app-topaz.vercel.app/)**

Use demo credentials: `demo@ticketapp.com` / `demo123`

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
- Local Storage for data persistence
- Client-side authentication with token management
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

```bash
# Start the Vite development server
npm run dev
```

This starts the application at: **http://localhost:5173**

**Note**: This React implementation uses localStorage for data persistence, so no separate API server is required.

### 3. Alternative Commands

```bash
# Build for production
npm run build

# Preview production build locally
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

## 🛠️ Data Management

### Local Storage Architecture

The application uses browser localStorage for data persistence, providing a client-side database experience:

```typescript
// Data is stored in localStorage keys:
'ticketapp_users'     // User accounts
'ticketapp_tickets'   // Ticket data
'ticketapp_auth'      // Authentication tokens
```

### API Layer (`src/lib/mockApi.ts`)

The mock API provides a consistent interface that could easily be replaced with real backend calls:

```typescript
// Core API functions
apiLogin(email, password)        // Authenticate user
apiGetTickets()                  // Fetch user's tickets
apiCreateTicket(ticketData)      // Create new ticket
apiUpdateTicket(id, updates)     // Update existing ticket
apiDeleteTicket(id)              // Delete ticket
apiGetStats()                    // Get dashboard statistics
```

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

### Vercel Deployment

This React app is configured for seamless deployment on Vercel:

```bash
# Build for production
npm run build

# Deploy to Vercel (if CLI is configured)
npm run deploy
```

### Vercel Configuration

The `vercel.json` handles SPA routing to prevent 404 errors on refresh:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Deployment Features

- ✅ **SPA Routing**: All routes serve `index.html`
- ✅ **Static Hosting**: No server required
- ✅ **CDN Distribution**: Global content delivery
- ✅ **Automatic HTTPS**: SSL certificates included

## 🐛 Troubleshooting

### Common Issues

**Authentication Problems:**
- Clear localStorage: `localStorage.clear()` in browser console
- Check browser developer tools → Application → Local Storage
- Verify demo user data is initialized

**Data Persistence Issues:**
- Check browser localStorage for `ticketapp_*` keys
- Clear all app data and refresh to reinitialize demo data

**Routing Issues:**
- Ensure Vercel deployment has correct `vercel.json` configuration
- Check that all routes redirect to `index.html` for SPA behavior

**Build Errors:**
- Run `npm run lint` to check for code issues
- Ensure all dependencies are installed: `npm install`
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

- [ ] Add comprehensive test suite (Jest + React Testing Library)
- [ ] Implement global state management (Zustand/Redux)
- [ ] Add error boundary components
- [ ] Implement progressive web app (PWA) features
- [ ] Add performance monitoring
- [ ] Implement caching strategies
- [ ] Add real-time updates with WebSockets
- [ ] Integrate with actual backend API

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

## 🔗 Related Projects

This React implementation is part of a multi-framework comparison project:

- **[Vue Implementation](../vue-ticket-management-app/)** - Vue.js + TypeScript version
- **[Twig Implementation](../twig-ticket-management-app/)** - PHP + Twig version
- **[Project Root](../README.md)** - Overview of all implementations

## 📄 License

This project is for educational purposes demonstrating different web development approaches.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Shadcn** for the beautiful UI components
- **Tailwind CSS** for the utility-first styling approach
- **Radix UI** for accessible component primitives
- **Vite** for the lightning-fast build tool

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**

*Part of the Multi-Framework Ticket Management System comparison project.*
