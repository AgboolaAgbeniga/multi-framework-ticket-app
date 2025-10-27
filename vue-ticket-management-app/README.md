# Vue Ticket Management App

A modern ticket management application built with Vue 3, TypeScript, and Tailwind CSS. This is one of three implementations (React/Vue/Twig) showcasing the same functionality across different web frameworks.

## 📸 Screenshots

*Coming soon - Screenshots of the Vue implementation will be added here*

## 🌐 Live Demo

**[Try the Vue Implementation](https://vue-ticket-app-ten.vercel.app/)**

Use demo credentials: `demo@ticketapp.com` / `demo123`

## Features

- **Ticket Management**: Create, edit, delete, and view tickets
- **Dashboard**: Overview of ticket statistics and recent activity
- **User Authentication**: Login and signup functionality
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Live notifications with Sonner
- **Local Storage**: Client-side data persistence

## Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Typed JavaScript for better development experience
- **Vue Router**: Official router for Vue.js
- **Pinia**: State management for Vue
- **Tailwind CSS**: Utility-first CSS framework
- **Radix Vue**: Accessible UI components
- **Vite**: Fast build tool and development server
- **Local Storage**: Client-side data persistence

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vue-ticket-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   This starts the application at: **http://localhost:5173**

   **Note**: This Vue implementation uses localStorage for data persistence, so no separate API server is required.

## Available Scripts

- `npm run dev` - Start development server with hot reload and mock backend
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── dashboard/       # Dashboard-specific components
│   ├── layout/          # Layout components (Header, Footer)
│   ├── tickets/         # Ticket-related components
│   └── ui/              # Base UI components
├── lib/                 # Utilities and services
├── router/              # Vue Router configuration
├── stores/              # Pinia state management
└── views/               # Page components
```

## Development

The app uses localStorage for data persistence, providing a client-side database experience. Demo data is automatically initialized when a user first logs in.

### Demo Credentials

Use these credentials to explore the application:
- **Email**: `demo@ticketapp.com`
- **Password**: `demo123`

The demo account comes pre-loaded with 10 sample tickets showcasing different statuses and priorities.

## Deployment

### Vercel Deployment

This Vue app is configured for seamless deployment on Vercel:

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

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## Related Projects

This Vue implementation is part of a multi-framework comparison project:

- **[React Implementation](../react-ticket-management-app/)** - React + TypeScript version
- **[Twig Implementation](../twig-ticket-management-app/)** - PHP + Twig version
- **[Project Root](../README.md)** - Overview of all implementations

## License

This project is for educational purposes demonstrating different web development approaches.

---

**Built with ❤️ using Vue.js, TypeScript, and modern web technologies.**

*Part of the Multi-Framework Ticket Management System comparison project.*