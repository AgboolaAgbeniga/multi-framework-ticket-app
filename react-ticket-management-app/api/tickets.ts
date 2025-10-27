import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'closed';
  userId: string;
  createdAt: string;
  updatedAt: string;
  priority?: string;
}

function readDb(): any {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { users: [], tickets: [], auth: { tokens: [] } };
  }
}

function writeDb(data: any): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function authenticate(req: VercelRequest): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  const db = readDb();

  // Validate token exists in our stored tokens
  const storedToken = db.auth?.tokens?.find((t: any) => t.token === token);
  if (!storedToken) {
    return null;
  }

  // Check if token is expired
  if (new Date(storedToken.expiresAt) < new Date()) {
    return null;
  }

  return storedToken.user.id;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = authenticate(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    // Get tickets for the authenticated user
    const db = readDb();
    const userTickets = db.tickets.filter((t: Ticket) => t.userId === userId);
    return res.status(200).json(userTickets);
  }

  if (req.method === 'POST') {
    // Create a new ticket
    const { title, description, status, priority } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = readDb();
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id: Math.random().toString(36).substring(2, 8),
      title,
      description: description || '',
      status,
      userId,
      createdAt: now,
      updatedAt: now,
      priority: priority || 'medium',
    };

    db.tickets.push(newTicket);
    writeDb(db);

    return res.status(201).json(newTicket);
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}