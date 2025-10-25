import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { getSession } from '../lib/auth';
import { apiGetStats } from '../lib/mockApi';
import { toast } from 'sonner';
import { Ticket, Clock, CheckCircle, FolderOpen, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    closed: 0
  });

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate('/auth/login');
      return;
    }

    // Fetch stats from API (JSON server) so dashboard reflects server data
    (async () => {
      try {
        const res = await apiGetStats();
        if (res.ok && res.data) {
          setStats(res.data);
        } else if (res.error === 'Unauthorized' || res.error === 'Token expired') {
          toast.error('Your session has expired — please log in again.');
          navigate('/auth/login');
        } else {
          // show a helpful error for failed stats load
          toast.error('Failed to load tickets. Please retry.');
        }
      } catch (e) {
        toast.error('Failed to load tickets. Please retry.');
      }
    })();
  }, [navigate]);

  const session = getSession();
  
  if (!session) {
    return null;
  }

  // Build a natural-language summary of status counts for the Status Overview
  const statusSummary = (() => {
    if (stats.total === 0) return '';
    const parts: string[] = [];
    if (stats.open > 0) parts.push(`${stats.open} open ${stats.open === 1 ? 'ticket' : 'tickets'}`);
    if (stats.inProgress > 0) parts.push(`${stats.inProgress} in progress`);
    if (stats.closed > 0) parts.push(`${stats.closed} resolved ${stats.closed === 1 ? 'ticket' : 'tickets'}`);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
    return `${parts.slice(0, -1).join(', ')}, and ${parts[parts.length - 1]}`;
  })();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-slate-50 py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="mb-2">Dashboard</h1>
              <p className="text-slate-600">
                Welcome back, {session.name}! Here's an overview of your tickets.
              </p>
            </div>
            <Button onClick={() => navigate('/tickets?new=true')} size="lg" className="shrink-0">
              <Ticket className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Tickets"
              value={stats.total}
              icon={Ticket}
              iconColor="text-indigo-600"
              iconBgColor="bg-indigo-100"
            />
            <StatCard
              title="Open Tickets"
              value={stats.open}
              icon={FolderOpen}
              iconColor="text-green-600"
              iconBgColor="bg-green-100"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={Clock}
              iconColor="text-amber-600"
              iconBgColor="bg-amber-100"
            />
            <StatCard
              title="Resolved"
              value={stats.closed}
              icon={CheckCircle}
              iconColor="text-slate-600"
              iconBgColor="bg-slate-100"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 bg-linear-to-br from-indigo-500 to-purple-600 text-white">
              <h3 className="text-white font-bold">Quick Actions</h3>
              <p className="text-white/90 mb-4 text-sm">
                Get started by creating a new ticket or manage your existing ones.
              </p>
              <div className="flex flex-wrap">
                
                {stats.total > 0 && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/tickets?status=open')}
                    className='w-full'
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    View {stats.total} Open Tickets
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-linear-to-br from-slate-50 to-slate-100/80">
              <h3 className="font-bold">Status Overview</h3>
              {stats.total === 0 ? (
                <p className="text-slate-600 mb-4 text-sm">No tickets yet. Create your first one!</p>
              ) : (
                <p className="text-slate-600 mb-4 text-sm">You have {statusSummary}.</p>
              )}
              {(stats.open > 0 || stats.inProgress > 0) && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full"
                  onClick={() => navigate('/tickets')}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
