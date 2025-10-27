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
  console.log('Frontend: Attempting login with email:', email);
  try {
    console.log('Frontend: Making fetch request to /api/login');
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    console.log('Frontend: Response status:', response.status);
    console.log('Frontend: Response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('Frontend: Response data:', data);

    if (!response.ok) {
      console.log('Frontend: Login failed with error:', data.error);
      return { ok: false, error: data.error || 'Login failed' };
    }

    console.log('Frontend: Login successful, storing token');
    localStorage.setItem(TOKEN_KEY, JSON.stringify(data));
    return { ok: true, data };
  } catch (error) {
    console.error('Frontend: Login network error:', error);
    return { ok: false, error: 'Network error' };
  }
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
  try {
    const token = getStoredToken();
    if (!token) return { ok: false, error: 'Unauthorized' };

    const response = await fetch('/api/tickets', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'Failed to fetch tickets' };
    }

    return { ok: true, data };
  } catch (error) {
    console.error('Get tickets error:', error);
    return { ok: false, error: 'Network error' };
  }
}

export async function apiCreateTicket(payload: {
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: string;
}): Promise<ApiResponse<Ticket>> {
  try {
    const token = getStoredToken();
    if (!token) return { ok: false, error: 'Unauthorized' };

    const response = await fetch('/api/tickets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { ok: false, error: data.error || 'Failed to create ticket' };
    }

    return { ok: true, data };
  } catch (error) {
    console.error('Create ticket error:', error);
    return { ok: false, error: 'Network error' };
  }
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
  }
};

// Initialize demo data on module load
initializeDemoData();
