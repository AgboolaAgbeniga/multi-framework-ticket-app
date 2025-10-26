import type { AuthToken, Ticket, User } from './types';

const API_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001';
const TOKEN_KEY = 'ticketapp_auth';
const TOKEN_EXPIRY_HOURS = 24;

interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
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

async function fetchWithAuth<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getStoredToken();
  
  // Allow public user endpoints (list/query and single user lookups) without a token
  // e.g. /users, /users?email=..., /users/1
  const isPublicUsersEndpoint = endpoint.startsWith('/users');
  if (!token && !isPublicUsersEndpoint) {
    return { ok: false, error: 'Unauthorized' };
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token.token}` }),
        ...options.headers,
      },
    });

    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      return { ok: false, error: 'Token expired' };
    }

    if (!response.ok) {
      return { ok: false, error: 'API request failed' };
    }

    const data = await response.json();
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: 'Network error' };
  }
}

export async function apiLogin(email: string, password: string): Promise<ApiResponse<AuthToken>> {
  const response = await fetchWithAuth<User[]>(`/users?email=${encodeURIComponent(email)}`);
  
  if (!response.ok) return { ok: false, error: response.error };
  if (!response.data?.length) return { ok: false, error: 'Invalid credentials' };
  
  const user = response.data[0];
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
  const checkExisting = await fetchWithAuth<User[]>('/users?email=' + email);
  if (checkExisting.data?.length) {
    return { ok: false, error: 'Email already exists' };
  }

  const newUser: User = {
    id: Date.now(),
    email,
    password,
    name,
  };

  const response = await fetchWithAuth<User>('/users', {
    method: 'POST',
    body: JSON.stringify(newUser),
  });

  return response;
}

export function apiLogout(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export async function apiGetTickets(): Promise<ApiResponse<Ticket[]>> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  return fetchWithAuth<Ticket[]>(`/tickets?userId=${token.user.id}`);
}

export async function apiCreateTicket(payload: {
  title: string;
  description?: string;
  status: 'open' | 'in_progress' | 'closed';
  priority: string;
}): Promise<ApiResponse<Ticket>> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const now = new Date().toISOString();
  const newTicket: Omit<Ticket, 'id'> = {
    title: payload.title,
    description: payload.description || '',
    status: payload.status,
    userId: token.user.id,
    createdAt: now,
    updatedAt: now,
  };

  return fetchWithAuth<Ticket>('/tickets', {
    method: 'POST',
    body: JSON.stringify(newTicket),
  });
}

export async function apiUpdateTicket(
  id: string | number,
  updates: Partial<Ticket>
): Promise<ApiResponse<Ticket>> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  // First fetch the ticket to verify ownership
  const ticket = await fetchWithAuth<Ticket>(`/tickets/${id}`);
  if (!ticket.ok) return ticket;
  if (ticket.data?.userId !== token.user.id) {
    return { ok: false, error: 'Unauthorized' };
  }

  const updatedTicket = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return fetchWithAuth<Ticket>(`/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedTicket),
  });
}

export async function apiDeleteTicket(id: string | number): Promise<ApiResponse<boolean>> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  // First fetch the ticket to verify ownership
  const ticket = await fetchWithAuth<Ticket>(`/tickets/${id}`);
  if (!ticket.ok) return { ok: false, error: ticket.error };
  if (ticket.data?.userId !== token.user.id) {
    return { ok: false, error: 'Unauthorized' };
  }

  const response = await fetchWithAuth<void>(`/tickets/${id}`, {
    method: 'DELETE',
  });

  return { ok: response.ok, data: response.ok, error: response.error };
}

export async function apiGetStats(): Promise<ApiResponse<any>> {
  const token = getStoredToken();
  if (!token) return { ok: false, error: 'Unauthorized' };

  const tickets = await fetchWithAuth<Ticket[]>(`/tickets?userId=${token.user.id}`);
  if (!tickets.ok) return tickets;

  const stats = {
    total: tickets.data?.length || 0,
    open: tickets.data?.filter(t => t.status === 'open').length || 0,
  inProgress: tickets.data?.filter(t => t.status === 'in_progress').length || 0,
    closed: tickets.data?.filter(t => t.status === 'closed').length || 0,
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
