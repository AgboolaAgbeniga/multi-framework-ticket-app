# Vue Ticket Management App

A modern ticket management application built with Vue 3, TypeScript, and Tailwind CSS. This app allows users to create, view, update, and manage support tickets with a clean, responsive interface.

## Features

- **Ticket Management**: Create, edit, delete, and view tickets
- **Dashboard**: Overview of ticket statistics and recent activity
- **User Authentication**: Login and signup functionality
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Live notifications with Sonner
- **Mock Backend**: JSON Server for development and testing

## Technologies Used

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Typed JavaScript for better development experience
- **Vue Router**: Official router for Vue.js
- **Pinia**: State management for Vue
- **Tailwind CSS**: Utility-first CSS framework
- **Radix Vue**: Accessible UI components
- **Vite**: Fast build tool and development server
- **JSON Server**: Mock REST API for development

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

   This will start both the Vite dev server and the JSON Server mock backend.

## Available Scripts

- `npm run dev` - Start development server with hot reload and mock backend
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run server` - Start JSON Server mock backend only

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

The app uses JSON Server for mock data during development. The database file is `db.json` in the root directory.

For production deployment, replace the mock API calls with actual backend endpoints.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

This project is licensed under the MIT License.