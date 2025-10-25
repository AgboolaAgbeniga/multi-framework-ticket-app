import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { TicketCard } from '../components/tickets/TicketCard';
import { TicketForm } from '../components/tickets/TicketForm';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getSession } from '../lib/auth';
import { apiGetTickets, apiCreateTicket, apiUpdateTicket, apiDeleteTicket } from '../lib/mockApi';
import type { Ticket, TicketStatus } from '../lib/storage';
import { toast } from 'sonner';
import { Plus, Filter } from 'lucide-react';

export function TicketManagement() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>(searchParams.get('status') || 'all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<Ticket | null>(null);

  useEffect(() => {
    const session = getSession();
    
    if (!session) {
      toast.error('Your session has expired — please log in again.');
      navigate('/auth/login');
      return;
    }

    loadTickets();
    
    // Handle query parameters
    if (searchParams.get('new') === 'true') {
      setIsFormOpen(true);
    }
  }, [navigate, searchParams]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredTickets(tickets);
    } else {
      setFilteredTickets(tickets.filter(t => t.status === filterStatus));
    }
  }, [filterStatus, tickets]);

  const loadTickets = () => {
    const session = getSession();
    if (!session) return;
    
    try {
      apiGetTickets().then((res) => {
        if (res.ok && Array.isArray(res.data)) setTickets(res.data as unknown as Ticket[]);
        else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
          toast.error('Your session has expired — please log in again.');
          navigate('/auth/login');
        } else {
          toast.error('Failed to load tickets. Please retry.');
        }
      });
    } catch {
      toast.error('Failed to load tickets. Please retry.');
    }
  };

  const handleCreateTicket = (data: {
    title: string;
    description: string;
    status: TicketStatus;
    priority: 'low' | 'medium' | 'high';
  }) => {
    const session = getSession();
    if (!session) return;

    try {
      apiCreateTicket(data).then((res) => {
        if (res.ok) {
          loadTickets();
          setIsFormOpen(false);
          toast.success('Ticket created successfully!');
        } else {
          if (res.error === 'Unauthorized' || res.error === 'Token expired') {
            toast.error('Your session has expired — please log in again.');
            navigate('/auth/login');
          } else {
            toast.error('Failed to create ticket. Please try again.');
          }
        }
      });
    } catch {
      toast.error('Failed to create ticket. Please try again.');
    }
  };

  const handleUpdateTicket = (data: {
    title: string;
    description: string;
    status: TicketStatus;
    priority: 'low' | 'medium' | 'high';
  }) => {
    const session = getSession();
    if (!session || !selectedTicket) return;

    try {
  apiUpdateTicket(selectedTicket.id, data).then((res) => {
        if (res.ok) {
          loadTickets();
          setIsFormOpen(false);
          setSelectedTicket(null);
          toast.success('Ticket updated successfully!');
        } else {
          if (res.error === 'Unauthorized' || res.error === 'Token expired') {
            toast.error('Your session has expired — please log in again.');
            navigate('/auth/login');
          } else {
            toast.error('Failed to update ticket. Please try again.');
          }
        }
      });
    } catch {
      toast.error('Failed to update ticket. Please try again.');
    }
  };

  const handleEditClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setTicketToDelete(ticket);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    const session = getSession();
    if (!session || !ticketToDelete) return;

    try {
  apiDeleteTicket(ticketToDelete.id).then((res) => {
        if (res.ok && res.data) {
          loadTickets();
          toast.success('Ticket deleted successfully!');
        } else {
          if (res.error === 'Unauthorized' || res.error === 'Token expired') {
            toast.error('Your session has expired — please log in again.');
            navigate('/auth/login');
          } else {
            toast.error('Failed to delete ticket. Please try again.');
          }
        }
      });
    } catch {
      toast.error('Failed to delete ticket. Please try again.');
    } finally {
      setIsDeleteDialogOpen(false);
      setTicketToDelete(null);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedTicket(null);
  };

  const session = getSession();
  
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-slate-50 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="mb-2">Ticket Management</h1>
              <p className="text-slate-600">
                Create, view, edit, and manage your support tickets
              </p>
            </div>
            <Button onClick={() => {
              setSelectedTicket(null);
              setIsFormOpen(true);
            }}>
              <Plus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Filter */}
          <div className="mb-6 flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-slate-600">
              Showing {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Tickets Grid */}
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                {filterStatus === 'all' 
                  ? 'No tickets yet. Create your first ticket to get started!' 
                  : `No ${filterStatus.replace('_', ' ')} tickets found.`}
              </p>
              {filterStatus === 'all' && (
                <Button onClick={() => {
                  setSelectedTicket(null);
                  setIsFormOpen(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Ticket
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) handleFormCancel();
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTicket ? 'Edit Ticket' : 'Create New Ticket'}
            </DialogTitle>
            <DialogDescription>
              {selectedTicket 
                ? 'Update the ticket details below.' 
                : 'Fill in the details to create a new ticket.'}
            </DialogDescription>
          </DialogHeader>
          <TicketForm
            ticket={selectedTicket}
            onSubmit={selectedTicket ? handleUpdateTicket : handleCreateTicket}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the ticket "{ticketToDelete?.title}". 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setIsDeleteDialogOpen(false);
              setTicketToDelete(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}
