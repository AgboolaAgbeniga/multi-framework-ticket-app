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

  // In a real implementation, you'd validate the token properly
  // For now, we'll assume the token is valid if it exists
  return token ? 'demo' : null; // Simplified for demo
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Tickets API called:', req.method, req.url);

  const userId = authenticate(req);
  if (!userId) {
    console.log('Authentication failed');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log('Authenticated user:', userId);

  if (req.method === 'GET') {
    // Get tickets for the authenticated user
    console.log('GET tickets for user:', userId);
    try {
      const db = readDb();
      console.log('Database read successful, total tickets:', db.tickets.length);
      const userTickets = db.tickets.filter((t: Ticket) => t.userId === userId);
      console.log('User tickets found:', userTickets.length);
      return res.status(200).json(userTickets);
    } catch (error) {
      console.error('Error reading tickets:', error);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'POST') {
    // Create a new ticket
    console.log('POST ticket for user:', userId, 'body:', req.body);
    const { title, description, status, priority } = req.body;

    if (!title || !status) {
      console.log('Missing required fields:', { title: !!title, status: !!status });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
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
      console.log('Ticket created successfully:', newTicket.id);

      return res.status(201).json(newTicket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      return res.status(500).json({ error: 'Failed to create ticket' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}