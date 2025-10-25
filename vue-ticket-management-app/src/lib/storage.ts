export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high';

export type Ticket = {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = 'ticketflex_tickets';

function read(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as Ticket[] : [];
  } catch {
    return [];
  }
}

function write(tickets: Ticket[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

export function getAllTickets(ownerId?: string): Ticket[] {
  const tickets = read();
  return ownerId ? tickets.filter((t) => t.ownerId === ownerId) : tickets;
}

export function createTicket(data: {
  title: string;
  description?: string;
  status: TicketStatus;
  priority: TicketPriority;
}, ownerId?: string) {
  const tickets = read();
  const now = new Date().toISOString();
  const newTicket: Ticket = {
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now,
    ownerId: ownerId ?? 'anonymous',
    ...data,
  } as Ticket;
  tickets.unshift(newTicket);
  write(tickets);
  return newTicket;
}

export function updateTicket(id: string, updates: Partial<Omit<Ticket, 'id' | 'ownerId' | 'createdAt'>> , ownerId?: string) {
  const tickets = read();
  const idx = tickets.findIndex((t) => t.id === id && (ownerId ? t.ownerId === ownerId : true));
  if (idx === -1) return null;
  tickets[idx] = { ...tickets[idx], ...updates, updatedAt: new Date().toISOString() } as Ticket;
  write(tickets);
  return tickets[idx];
}

export function deleteTicket(id: string, ownerId?: string) {
  const tickets = read();
  const filtered = tickets.filter((t) => !(t.id === id && (ownerId ? t.ownerId === ownerId : true)));
  write(filtered);
  return tickets.length !== filtered.length;
}

export function getTicketStats(ownerId?: string) {
  const tickets = getAllTickets(ownerId);
  return {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'open').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
  };
}

export default {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketStats,
};