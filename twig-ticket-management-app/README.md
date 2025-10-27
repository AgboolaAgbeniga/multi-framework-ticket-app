# Twig Ticket Management App

A fully functional ticket management system built with PHP, Twig templating, and Tailwind CSS. This is one of three implementations (React/Vue/Twig) showcasing the same functionality across different web frameworks using server-side rendering.

## 🌐 Live Demo

**[Try the Twig Implementation](https://twig-ticket-app-035g.onrender.com)**

Use demo credentials: `demo@ticketapp.com` / `demo123`

## Features

- **User Authentication**: Login and registration with session management
- **Dashboard**: Overview with ticket statistics and analytics
- **Ticket Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **MVC Architecture**: Clean separation of concerns with Models, Views, and Controllers

## Tech Stack

- **Backend**: PHP 8.1+
- **Templating**: Twig 3.0
- **Styling**: Tailwind CSS
- **Routing**: Symfony Routing component
- **HTTP Handling**: Symfony HTTP Foundation
- **Data Storage**: JSON files (easily replaceable with SQLite or database)

## Installation

1. **Clone or download** the project files

2. **Install dependencies** (if you have Composer):
   ```bash
   composer install
   ```

3. **Set up web server**:
   - Point your web server to the `public/` directory
   - Ensure PHP 8.1+ is available
   - Make sure the `data/` directory is writable

4. **Access the application**:
   - Open your browser and navigate to the application URL
   - Default demo account: `demo@ticketapp.com` / `demo123`

## Project Structure

```
twig-ticket-management-app/
├── app/
│   ├── Controllers/          # Business logic controllers
│   ├── Models/              # Data models
│   └── templates/           # Twig templates
│       ├── layouts/         # Base layouts
│       ├── auth/           # Authentication views
│       ├── dashboard/      # Dashboard views
│       └── tickets/        # Ticket management views
├── data/                    # JSON data storage
├── public/                  # Web root
│   └── index.php           # Entry point
├── assets/                  # Static assets (images, etc.)
└── composer.json           # Dependencies
```

## Routes

- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard with statistics
- `/tickets` - Ticket listing and management
- `/tickets/create` - Create new ticket
- `/tickets/{id}/edit` - Edit existing ticket
- `/logout` - User logout

## Key Features Matching React Version

- **Same UI/UX**: Identical design and user experience
- **Same Color Scheme**: Gradient backgrounds, consistent styling
- **Same Functionality**: All CRUD operations, filtering, validation
- **Responsive**: Works on all device sizes
- **Session Management**: Secure user authentication
- **Form Validation**: Client and server-side validation
- **Flash Messages**: Success/error notifications

## Data Storage

The application uses JSON files for data persistence:
- `data/users.json` - User accounts
- `data/tickets.json` - Ticket data

This can be easily replaced with SQLite or a full database system.

## Demo Data

A demo user is pre-configured with sample tickets:
- Email: `demo@ticketapp.com`
- Password: `demo123`

The demo account comes pre-loaded with 10 sample tickets showcasing different statuses (open, in_progress, closed) and priorities (high, medium, low).

## Development Notes

- Twig templates are cached in development mode for performance
- All routes are protected except landing page, login, and register
- Form validation includes both client-side and server-side checks
- Error handling provides user-friendly messages
- The application follows MVC principles for maintainability

## Deployment

### Vercel Deployment

This Twig app is configured for deployment on Vercel with PHP runtime:

```bash
# The app is ready for Vercel deployment
# Vercel automatically detects PHP applications
```

### Render Configuration

The Twig app is configured for deployment on Render with the following setup:

- **Build Command**: `composer install`
- **Start Command**: `php -S 0.0.0.0:$PORT -t public`
- **Environment**: PHP 8.1+
- **Root Directory**: `/opt/render/project/src` (points to twig-ticket-management-app)

### Requirements

- PHP 8.1+ runtime
- Writable `data/` directory for JSON storage
- Composer dependencies installed

## Related Projects

This Twig implementation is part of a multi-framework comparison project:

- **[React Implementation](../react-ticket-management-app/)** - React + TypeScript version
- **[Vue Implementation](../vue-ticket-management-app/)** - Vue.js + TypeScript version
- **[Project Root](../README.md)** - Overview of all implementations

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

---

**Built with ❤️ using PHP, Twig, and traditional server-side technologies.**

*Part of the Multi-Framework Ticket Management System comparison project.*