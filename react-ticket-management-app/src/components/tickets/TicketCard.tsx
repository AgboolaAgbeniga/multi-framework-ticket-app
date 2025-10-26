import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import type { Ticket, TicketStatus, TicketPriority } from '../../lib/storage';
import { Edit, Trash2, Clock } from 'lucide-react';
import { formatDateTime, getDetailedDateTime } from '../../lib/dateUtils';

interface TicketCardProps {
  ticket: Ticket;
  onEdit: (ticket: Ticket) => void;
  onDelete: (ticket: Ticket) => void;
}

const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-green-100 text-green-800 border-green-200' },
  in_progress: { label: 'In Progress', className: 'bg-amber-100 text-amber-800 border-amber-200' },
  closed: { label: 'Closed', className: 'bg-slate-100 text-slate-800 border-slate-200' }
};

const priorityConfig: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  medium: { label: 'Medium', className: 'bg-purple-100 text-purple-800 border-purple-200' },
  high: { label: 'High', className: 'bg-red-100 text-red-800 border-red-200' }
};

export function TicketCard({ ticket, onEdit, onDelete }: TicketCardProps) {
  const statusInfo = statusConfig[ticket.status];
  const priorityInfo = ticket.priority ? priorityConfig[ticket.priority] : null;

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="mb-2">{ticket.title}</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
            {priorityInfo && (
              <Badge variant="outline" className={priorityInfo.className}>
                {priorityInfo.label}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {ticket.description && (
        <p className="text-slate-600 text-sm mb-4 overflow-hidden" style={{ 
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {ticket.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <div className="flex items-center gap-1" title={getDetailedDateTime(ticket.createdAt)}>
            <Clock className="w-4 h-4" />
            <span>Created {formatDateTime(ticket.createdAt)}</span>
          </div>
          {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
            <div className="flex items-center gap-1" title={getDetailedDateTime(ticket.updatedAt)}>
              <Clock className="w-4 h-4 text-indigo-500" />
              <span className="text-indigo-600">
                Updated {formatDateTime(ticket.updatedAt)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(ticket)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(ticket)}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
}
