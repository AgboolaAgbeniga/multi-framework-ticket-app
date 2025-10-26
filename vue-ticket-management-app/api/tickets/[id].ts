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
  const { id } = req.query;
  const ticketId = Array.isArray(id) ? id[0] : id;

  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  const userId = authenticate(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = readDb();
  const ticketIndex = db.tickets.findIndex((t: Ticket) => t.id === ticketId);

  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }

  const ticket = db.tickets[ticketIndex];

  // Check if the ticket belongs to the authenticated user
  if (ticket.userId !== userId) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    return res.status(200).json(ticket);
  }

  if (req.method === 'PATCH') {
    // Update ticket
    const updates = req.body;
    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.tickets[ticketIndex] = updatedTicket;
    writeDb(db);

    return res.status(200).json(updatedTicket);
  }

  if (req.method === 'DELETE') {
    // Delete ticket
    db.tickets.splice(ticketIndex, 1);
    writeDb(db);

    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}