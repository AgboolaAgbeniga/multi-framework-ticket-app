export interface AuthToken {
  token: string;
  expiresAt: string; // ISO date string
  user: {
    id: number | string;
    email: string;
    name: string;
  };
}

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  userId: number | string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
}