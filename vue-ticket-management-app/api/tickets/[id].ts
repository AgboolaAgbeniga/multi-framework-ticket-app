import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

const DB_KEY = 'ticket-app-db';

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

async function readDb(): Promise<any> {
  try {
    const data = await kv.get(DB_KEY);
    return data || { users: [], tickets: [], auth: { tokens: [] } };
  } catch (error) {
    console.error('Error reading from KV:', error);
    return { users: [], tickets: [], auth: { tokens: [] } };
  }
}

async function writeDb(data: any): Promise<void> {
  try {
    await kv.set(DB_KEY, data);
  } catch (error) {
    console.error('Error writing to KV:', error);
    throw error;
  }
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
  console.log('Ticket [id] API called:', req.method, req.url);

  const { id } = req.query;
  const ticketId = Array.isArray(id) ? id[0] : id;
  console.log('Ticket ID:', ticketId);

  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required' });
  }

  const userId = authenticate(req);
  if (!userId) {
    console.log('Authentication failed for ticket operation');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  console.log('Authenticated user for ticket operation:', userId);

  let db: any;
  let ticketIndex: number;
  let ticket: Ticket;

  try {
    db = await readDb();
    console.log('Database read successful for ticket operation');
    ticketIndex = db.tickets.findIndex((t: Ticket) => t.id === ticketId);

    if (ticketIndex === -1) {
      console.log('Ticket not found:', ticketId);
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket = db.tickets[ticketIndex];
    console.log('Ticket found, checking ownership');

    // Check if the ticket belongs to the authenticated user
    if (ticket.userId !== userId) {
      console.log('Forbidden: ticket userId', ticket.userId, 'does not match authenticated userId', userId);
      return res.status(403).json({ error: 'Forbidden' });
    }
    console.log('Ticket ownership verified');
  } catch (error) {
    console.error('Error in ticket operation:', error);
    return res.status(500).json({ error: 'Database error' });
  }

  if (req.method === 'GET') {
    console.log('Returning ticket data');
    return res.status(200).json(ticket);
  }

  if (req.method === 'PATCH') {
    // Update ticket
    console.log('Updating ticket with body:', req.body);
    const updates = req.body;
    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    db.tickets[ticketIndex] = updatedTicket;
    await writeDb(db);
    console.log('Ticket updated successfully');

    return res.status(200).json(updatedTicket);
  }

  if (req.method === 'DELETE') {
    // Delete ticket
    console.log('Deleting ticket');
    db.tickets.splice(ticketIndex, 1);
    await writeDb(db);
    console.log('Ticket deleted successfully');

    return res.status(204).end();
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}