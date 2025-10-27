# Twig Ticket Management App

A fully functional ticket management system built with PHP, Twig templating, and Tailwind CSS. This is a recreation of the React version using server-side rendering.

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

A demo user is pre-configured:
- Email: `demo@ticketapp.com`
- Password: `demo123`

## Development Notes

- Twig templates are cached in development mode for performance
- All routes are protected except landing page, login, and register
- Form validation includes both client-side and server-side checks
- Error handling provides user-friendly messages
- The application follows MVC principles for maintainability

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes