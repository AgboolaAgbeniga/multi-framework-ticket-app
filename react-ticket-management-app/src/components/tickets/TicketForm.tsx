import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { Ticket, TicketStatus, TicketPriority } from '../../lib/storage';
import { AlertCircle } from 'lucide-react';

interface TicketFormProps {
  ticket?: Ticket | null;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TicketStatus;
    priority: TicketPriority;
  }) => void;
  onCancel: () => void;
}

export function TicketForm({ ticket, onSubmit, onCancel }: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TicketStatus>('open');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [errors, setErrors] = useState<{
    title?: string;
    status?: string;
  }>({});

  useEffect(() => {
    if (ticket) {
      setTitle(ticket.title);
      setDescription(ticket.description || '');
      setStatus(ticket.status);
      setPriority(ticket.priority || 'medium');
    } else {
      setTitle('');
      setDescription('');
      setStatus('open');
      setPriority('medium');
    }
  }, [ticket]);

  const validate = () => {
    const newErrors: { title?: string; status?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.length > 100) {
      newErrors.title = 'Title must not exceed 100 characters';
    }

    if (!status) {
      newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title" className='mb-2'>Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setErrors(prev => ({ ...prev, title: undefined }));
          }}
          placeholder="Enter ticket title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.title}</span>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="description" className='mb-2'>Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter ticket description (optional)"
          rows={4}
          maxLength={500}
        />
        <p className="text-xs text-slate-500 mt-1">
          {description.length}/500 characters
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="status" className='mb-2'>Status *</Label>
          <Select value={status} onValueChange={(value) => setStatus(value as TicketStatus)}>
            <SelectTrigger id="status" className={errors.status ? 'border-red-500' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>{errors.status}</span>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="priority" className='mb-2'>Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {ticket ? 'Update Ticket' : 'Create Ticket'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
