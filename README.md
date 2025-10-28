# Multi-Framework Ticket Management System

A comprehensive ticket management application implemented in three different modern web frameworks, demonstrating how the same application can be built using React, Vue, and PHP/Twig while maintaining identical functionality and UI/UX.

## 🎯 Project Overview

**TicketFlex** is a full-featured ticket management system that allows teams to efficiently track, manage, and resolve customer support issues. The project showcases three different implementations of the same application, each built with a different technology stack.

### Demo Account

All three applications share the same demo credentials:
- **Email**: `demo@ticketapp.com`
- **Password**: `demo123`

## 📦 Three Implementations

### 1. React + TypeScript Implementation
📍 **Location**: `react-ticket-management-app/`

A modern React 19 application with TypeScript, built using the latest features and best practices.

**Technology Stack:**
- ⚛️ React 19.1.1 with TypeScript
- ⚡ Vite 7.1.7 for build tooling
- 🎨 Tailwind CSS 4.1.16
- 🧩 Shadcn/ui component library
- 🎯 Radix UI primitives
- 🔗 React Router DOM
- 💾 JSON Server for mock API
- 📦 Concurrently for dev servers

**Key Features:**
- Hot Module Replacement (HMR)
- Full TypeScript support
- Component-based architecture
- Reusable UI components
- Real-time toast notifications

**Getting Started:**
```bash
cd react-ticket-management-app
npm install
npm run dev
```

Access at: http://localhost:5173

---

### 2. Vue 3 + TypeScript Implementation
📍 **Location**: `vue-ticket-management-app/`

A progressive Vue 3 application with TypeScript, showcasing Vue's reactive system and modern development approach.

**Technology Stack:**
- 🖖 Vue 3.4.0
- 📘 TypeScript
- 🎨 Tailwind CSS 4.1.16
- 🗺️ Vue Router 4.3.0
- 🍍 Pinia for state management
- 🧩 Radix Vue components
- ⚡ Vite 6.4.1
- 💾 JSON Server for mock API
- 📦 Concurrently for dev servers

**Key Features:**
- Composition API
- Pinia state management
- Reactive data binding
- Progressive enhancement
- Vue DevTools support

**Getting Started:**
```bash
cd vue-ticket-management-app
npm install
npm run dev
```

Access at: http://localhost:5173

---

### 3. PHP + Twig Implementation
📍 **Location**: `twig-ticket-management-app/`

A server-side rendered application using PHP with Twig templating engine, providing SEO benefits and traditional web architecture.

**Technology Stack:**
- 🐘 PHP 8.4
- 🎨 Twig 3.0 templating engine
- 🛣️ Symfony Routing component
- 🌐 Symfony HTTP Foundation
- 🎨 Tailwind CSS
- 🐳 Docker support
- 📄 JSON file storage

**Key Features:**
- Server-side rendering (SSR)
- MVC architecture
- Session management
- Traditional form submissions
- SEO-friendly
- No JavaScript build process

**Getting Started:**

**Option 1: PHP Built-in Server**
```bash
cd twig-ticket-management-app
php -S localhost:8000 -t public/
```

**Option 2: Docker**
```bash
cd twig-ticket-management-app
docker build -t twig-ticket-app .
docker run -p 8080:80 twig-ticket-app
```

Access at: http://localhost:8000 or http://localhost:8080

---

## 🎨 Shared Design & Features

All three implementations share:

### Core Functionality
- ✅ **User Authentication**: Login and registration
- ✅ **Dashboard**: Analytics and statistics
- ✅ **Ticket Management**: Full CRUD operations
- ✅ **Filtering**: Status-based ticket filtering
- ✅ **Validation**: Form validation with error messages
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Modern UI**: Consistent design language
- ✅ **Loading States**: Skeleton loaders and progress indicators
- ✅ **Error Handling**: User-friendly error messages

### Design Elements
- 🎨 **Color Scheme**: Consistent gradient backgrounds
- 📱 **Responsive Layout**: Works on all device sizes
- 🎯 **UI Components**: Match Radix UI design system
- 🔤 **Typography**: Consistent font system
- 📊 **Dashboard Stats**: Same metrics across all versions
- 🎫 **Ticket Cards**: Identical card design

### User Interface
- 🏠 **Landing Page**: Introduction and features
- 🔐 **Authentication Pages**: Login and signup forms
- 📊 **Dashboard**: Statistics and overview
- 🎫 **Ticket Management**: List, create, edit, delete tickets
- 📱 **Mobile Navigation**: Responsive header and footer

---

## 🏗️ Architecture Comparison

| Feature | React | Vue | PHP/Twig |
|---------|-------|-----|----------|
| **Rendering** | Client-side | Client-side | Server-side |
| **State Management** | React Hooks | Pinia | Session/Server |
| **Routing** | React Router | Vue Router | Symfony Router |
| **Styling** | Tailwind CSS | Tailwind CSS | Tailwind CSS |
| **Backend** | JSON Server (mock) | JSON Server (mock) | PHP with JSON |
| **Type Safety** | TypeScript | TypeScript | PHP type hints |
| **Component System** | Functional components | SFC (Single File Components) | Twig templates |
| **Hot Reload** | ✅ Vite HMR | ✅ Vite HMR | ❌ Manual refresh |
| **SEO** | Requires SSR setup | Requires SSR setup | ✅ Built-in |
| **Build Size** | Larger (runtime required) | Medium | Small (no JS framework) |

---

## 📂 Project Structure

```
multi-framework-ticket-app/
├── react-ticket-management-app/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page views
│   │   ├── lib/            # Utilities
│   │   └── main.tsx        # Entry point
│   ├── db.json            # Mock database
│   └── package.json        # Dependencies
│
├── vue-ticket-management-app/
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/         # Page views
│   │   ├── stores/        # Pinia stores
│   │   ├── router/        # Vue Router
│   │   └── main.ts        # Entry point
│   ├── db.json            # Mock database
│   └── package.json        # Dependencies
│
├── twig-ticket-management-app/
│   ├── app/
│   │   ├── Controllers/   # PHP controllers
│   │   ├── Models/        # Data models
│   │   └── templates/     # Twig templates
│   ├── public/            # Web root
│   ├── data/              # JSON storage
│   └── composer.json      # PHP dependencies
│
└── README.md              # This file
```

---

## 🚀 Quick Start Guide

### Running All Three Applications

**React Application:**
```bash
cd react-ticket-management-app
npm install
npm run dev
# Visit http://localhost:5173
```

**Vue Application:**
```bash
cd vue-ticket-management-app
npm install
npm run dev
# Visit http://localhost:5173 (default port if React isn't running)
```

**PHP/Twig Application:**
```bash
cd twig-ticket-management-app
composer install
php -S localhost:8000 -t public/
# Visit http://localhost:8000
```

---

## 🎯 Use Cases

This project is ideal for:

1. **Learning**: Compare how different frameworks solve the same problems
2. **Portfolio**: Showcase versatility across multiple frameworks
3. **Reference**: Template for building ticket management systems
4. **Architecture Study**: Understand trade-offs between frameworks
5. **Team Training**: Train developers on different tech stacks

---

## 🤔 Which Framework to Choose?

### Choose **React** if you need:
- Extensive ecosystem and libraries
- Large community support
- Component-based architecture
- Rich developer tools
- Flexible state management

### Choose **Vue** if you need:
- Simpler learning curve
- Progressive enhancement
- Built-in state management (Pinia)
- Smaller bundle size
- Reactive data binding

### Choose **PHP/Twig** if you need:
- SEO-optimized applications
- Traditional web architecture
- No JavaScript build process
- Server-side rendering
- Lower initial page load time

---

## 🛠️ Development

### Prerequisites

- **Node.js**: v18+ (for React and Vue)
- **PHP**: 8.4+ (for Twig version)
- **npm**: Bundled with Node.js
- **Composer**: For PHP dependencies (optional for Twig)

### Development Workflow

1. **Choose your framework** of interest
2. **Navigate** to the corresponding directory
3. **Install dependencies** (npm install or composer install)
4. **Start development server** (npm run dev or php -S)
5. **Open browser** to the local URL
6. **Login** with demo credentials

---

## 📊 Feature Parity

All three implementations support:

| Feature | React | Vue | PHP/Twig |
|---------|:-----:|:---:|:--------:|
| Authentication | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ |
| Create Ticket | ✅ | ✅ | ✅ |
| Edit Ticket | ✅ | ✅ | ✅ |
| Delete Ticket | ✅ | ✅ | ✅ |
| Filter Tickets | ✅ | ✅ | ✅ |
| Form Validation | ✅ | ✅ | ✅ |
| Session Management | ✅ | ✅ | ✅ |
| Responsive Design | ✅ | ✅ | ✅ |
| Loading States | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ |

---

## 🐛 Troubleshooting

### React/Vue Issues
- **Port Conflicts**: Change port in vite.config.ts or use different ports
- **Build Errors**: Clear node_modules and reinstall
- **CORS Issues**: Ensure JSON Server is running

### PHP/Twig Issues
- **Permission Errors**: Make data/ directory writable
- **Composer Issues**: Run `composer install --no-dev`
- **Sessions**: Clear browser cookies if authentication fails

### General Issues
- **Database Reset**: Delete db.json files to reset data
- **Cache Issues**: Clear browser cache and localStorage
- **Style Issues**: Ensure Tailwind CSS is loaded properly

---

## 📝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs**: Open an issue for any bugs you find
2. **Feature Requests**: Suggest new features
3. **Code Contributions**: Submit pull requests
4. **Documentation**: Improve documentation
5. **Testing**: Add tests to any of the implementations

---

## 📄 License

This project is open source and available for educational purposes.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vue.js Team** - For the progressive framework
- **PHP/Twig Community** - For the templating engine
- **Shadcn/Radix UI** - For accessible components
- **Tailwind CSS** - For the utility-first approach
- **JSON Server** - For the mock API

---

## 🌟 Features Summary

### All Applications Include:
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 Secure authentication system
- 📊 Dashboard with statistics
- 🎫 Full ticket management (CRUD)
- 📱 Mobile-friendly design
- ✅ Form validation
- 💾 Session persistence
- 🎯 Consistent user experience

### Uniquely React:
- ⚡ Hot Module Replacement
- 🔄 Real-time updates
- 🧪 Component testing ready
- 📦 Massive ecosystem

### Uniquely Vue:
- 🎯 Simpler syntax
- 🔄 Reactive reactivity
- 🍍 Pinia state management
- 📉 Smaller bundle size

### Uniquely PHP/Twig:
- 🚀 SEO-optimized
- 📄 Server-side rendering
- 🔧 No build process
- 💰 Low hosting costs

---

**Built with ❤️ to demonstrate the same application in React, Vue, and PHP/Twig.**
