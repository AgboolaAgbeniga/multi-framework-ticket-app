import type { AuthToken, Ticket, User } from './types';

const TOKEN_KEY = 'ticketapp_auth';
const USERS_KEY = 'ticketapp_users';
const TICKETS_KEY = 'ticketapp_tickets';
const TOKEN_EXPIRY_HOURS = 24;

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

// Local storage helpers
function getStoredData<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setStoredData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getStoredToken(): AuthToken | null {
  const stored = localStorage.getItem(TOKEN_KEY);
  if (!stored) return null;

  try {
    const token = JSON.parse(stored) as AuthToken;
    if (new Date(token.expiresAt) < new Date()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return token;
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
}

// Simulate async operations for consistency with original API
async function delay(ms: number = 100): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function apiLogin(email: string, password: string): Promise<ApiResponse<AuthToken>> {
  await delay();

  const users = getStoredData<User>(USERS_KEY);
  const user = users.find(u => u.email === email);

  if (!user) return { ok: false, error: 'Invalid credentials' };
  if (user.password !== password) return { ok: false, error: 'Invalid credentials' };

  const token: AuthToken = {
    token: Math.random().toString(36).slice(2) + Date.now().toString(36),
    expiresAt: new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000).toISOString(),
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  };

  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  return { ok: true, data: token };
}

export async function apiSignup(email: string, password: string, name: string): Promise<ApiResponse<User>> {
  await delay();

  const users = getStoredData<User>(USERS_KEY);
  const existingUser = users.find(u => u.email === email);

  if (existingUser) {
    return { ok: false, error: 'Email already exists' };
  }

  const newUser: User = {
    id: Date.now(),
    email,
    password,
    name,
  };

  users.push(newUser);
  setStoredData(USERS_KEY, users);

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser;
  return { ok: true, data: userWithoutPassword as User };
}

export function apiLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiGetTickets(): Promise<ApiResponse<Ticket[]>> {
  await delay();

  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const tickets = getStoredData<Ticket>(TICKETS_KEY);
  const userTickets = tickets.filter(t => t.userId === token.user.id);

  return { ok: true, data: userTickets };
}

export async function apiCreateTicket(payload: {
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: string;
}): Promise<ApiResponse<Ticket>> {
  await delay();

  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const now = new Date().toISOString();
  const newTicket: Ticket = {
    id: Date.now(),
    title: payload.title,
    description: payload.description || '',
    status: payload.status,
    userId: token.user.id,
    createdAt: now,
    updatedAt: now,
    priority: payload.priority,
  };

  const tickets = getStoredData<Ticket>(TICKETS_KEY);
  tickets.push(newTicket);
  setStoredData(TICKETS_KEY, tickets);

  return { ok: true, data: newTicket };
}

export async function apiUpdateTicket(
  id: string | number,
  updates: Partial<Ticket>
): Promise<ApiResponse<Ticket>> {
  await delay();

  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const tickets = getStoredData<Ticket>(TICKETS_KEY);
  const ticketIndex = tickets.findIndex(t => t.id === id);

  if (ticketIndex === -1) {
    return { ok: false, error: 'Ticket not found' };
  }

  const ticket = tickets[ticketIndex];
  if (ticket.userId !== token.user.id) {
    return { ok: false, error: 'Unauthorized' };
  }

  const updatedTicket = {
    ...ticket,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  tickets[ticketIndex] = updatedTicket;
  setStoredData(TICKETS_KEY, tickets);

  return { ok: true, data: updatedTicket };
}

export async function apiDeleteTicket(id: string | number): Promise<ApiResponse<boolean>> {
  await delay();

  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const tickets = getStoredData<Ticket>(TICKETS_KEY);
  const ticketIndex = tickets.findIndex(t => t.id === id);

  if (ticketIndex === -1) {
    return { ok: false, error: 'Ticket not found' };
  }

  const ticket = tickets[ticketIndex];
  if (ticket.userId !== token.user.id) {
    return { ok: false, error: 'Unauthorized' };
  }

  tickets.splice(ticketIndex, 1);
  setStoredData(TICKETS_KEY, tickets);

  return { ok: true, data: true };
}

export async function apiGetStats(): Promise<ApiResponse<any>> {
  await delay();

  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const tickets = getStoredData<Ticket>(TICKETS_KEY);
  const userTickets = tickets.filter(t => t.userId === token.user.id);

  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t: Ticket) => t.status === 'open').length,
    inProgress: userTickets.filter((t: Ticket) => t.status === 'in_progress').length,
    closed: userTickets.filter((t: Ticket) => t.status === 'closed').length,
  };

  return { ok: true, data: stats };
}

export function getCurrentUser(): AuthToken['user'] | null {
  const token = getStoredToken();
  return token?.user || null;
}

export default {
  apiLogin,
  apiSignup,
  apiLogout,
  apiGetTickets,
  apiCreateTicket,
  apiUpdateTicket,
  apiDeleteTicket,
  apiGetStats,
  getCurrentUser,
};

// Initialize with demo data if no users exist
const initializeDemoData = () => {
  const users = getStoredData<User>(USERS_KEY);
  if (users.length === 0) {
    const demoUser: User = {
      id: 1,
      email: 'demo@ticketapp.com',
      password: 'demo123',
      name: 'Demo User',
    };
    setStoredData(USERS_KEY, [demoUser]);

    // Initialize demo tickets for the demo user
    const tickets = getStoredData<Ticket>(TICKETS_KEY);
    if (tickets.length === 0) {
      const demoTickets: Ticket[] = [
        {
          id: 1,
          title: 'Website Login Issue',
          description: 'Users are unable to login to the website. The login form is not responding.',
          status: 'open',
          userId: 1,
          createdAt: '2024-01-15T10:00:00.000Z',
          updatedAt: '2024-01-15T10:00:00.000Z',
          priority: 'high'
        },
        {
          id: 2,
          title: 'Database Connection Error',
          description: 'The application is showing database connection errors intermittently.',
          status: 'in_progress',
          userId: 1,
          createdAt: '2024-01-14T14:30:00.000Z',
          updatedAt: '2024-01-16T09:15:00.000Z',
          priority: 'high'
        },
        {
          id: 3,
          title: 'Mobile App Crashing',
          description: 'The mobile app crashes when users try to upload images.',
          status: 'open',
          userId: 1,
          createdAt: '2024-01-13T16:45:00.000Z',
          updatedAt: '2024-01-13T16:45:00.000Z',
          priority: 'medium'
        },
        {
          id: 4,
          title: 'Email Notifications Not Working',
          description: 'Users are not receiving email notifications for ticket updates.',
          status: 'closed',
          userId: 1,
          createdAt: '2024-01-12T11:20:00.000Z',
          updatedAt: '2024-01-18T13:30:00.000Z',
          priority: 'medium'
        },
        {
          id: 5,
          title: 'Payment Gateway Integration',
          description: 'Need to integrate Stripe payment gateway for subscription plans.',
          status: 'open',
          userId: 1,
          createdAt: '2024-01-11T09:00:00.000Z',
          updatedAt: '2024-01-11T09:00:00.000Z',
          priority: 'high'
        },
        {
          id: 6,
          title: 'UI/UX Improvements',
          description: 'Update the dashboard design to improve user experience.',
          status: 'in_progress',
          userId: 1,
          createdAt: '2024-01-10T15:30:00.000Z',
          updatedAt: '2024-01-17T10:45:00.000Z',
          priority: 'low'
        },
        {
          id: 7,
          title: 'API Rate Limiting',
          description: 'Implement rate limiting for API endpoints to prevent abuse.',
          status: 'open',
          userId: 1,
          createdAt: '2024-01-09T12:15:00.000Z',
          updatedAt: '2024-01-09T12:15:00.000Z',
          priority: 'medium'
        },
        {
          id: 8,
          title: 'Data Backup Issues',
          description: 'Automated backups are failing and need to be fixed.',
          status: 'closed',
          userId: 1,
          createdAt: '2024-01-08T08:45:00.000Z',
          updatedAt: '2024-01-19T14:20:00.000Z',
          priority: 'high'
        },
        {
          id: 9,
          title: 'Performance Optimization',
          description: 'Optimize database queries to improve application performance.',
          status: 'in_progress',
          userId: 1,
          createdAt: '2024-01-07T13:00:00.000Z',
          updatedAt: '2024-01-16T16:30:00.000Z',
          priority: 'medium'
        },
        {
          id: 10,
          title: 'Security Vulnerability',
          description: 'Address potential security vulnerability in user authentication.',
          status: 'open',
          userId: 1,
          createdAt: '2024-01-06T10:30:00.000Z',
          updatedAt: '2024-01-06T10:30:00.000Z',
          priority: 'high'
        }
      ];
      setStoredData(TICKETS_KEY, demoTickets);
    }
  }
};

// Initialize demo data on module load
initializeDemoData();
