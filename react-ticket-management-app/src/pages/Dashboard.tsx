import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { StatCard } from '../components/dashboard/StatCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { getSession } from '../lib/auth';
import { apiGetStats } from '../lib/mockApi';
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
        } else {
          // fallback to zeroed stats already set
        }
      } catch (e) {
        // ignore and keep defaults
      }
    })();
  }, [navigate]);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 md:col-span-2 bg-linear-to-br from-indigo-500 to-purple-600 text-white">
              <h3 className="mb-2 text-white">Quick Actions</h3>
              <p className="text-white/90 mb-6">
                Get started by creating a new ticket or manage your existing ones.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/tickets?new=true')}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => navigate('/tickets')}
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  View All Tickets
                </Button>
                {stats.open > 0 && (
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/tickets?status=open')}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    View {stats.open} Open Tickets
                  </Button>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-linear-to-br from-slate-50 to-slate-100/80">
              <h3 className="mb-2">Status Overview</h3>
              <p className="text-slate-600 mb-4">
                You have:
              </p>
              <ul className="space-y-2 mb-4 text-sm">
                {stats.open > 0 && (
                  <li className="flex items-center gap-2 text-green-700">
                    <FolderOpen className="w-4 h-4" />
                    {stats.open} open tickets
                  </li>
                )}
                {stats.inProgress > 0 && (
                  <li className="flex items-center gap-2 text-amber-700">
                    <Clock className="w-4 h-4" />
                    {stats.inProgress} in progress
                  </li>
                )}
                {stats.closed > 0 && (
                  <li className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-4 h-4" />
                    {stats.closed} resolved tickets
                  </li>
                )}
                {stats.total === 0 && (
                  <li className="text-slate-600">
                    No tickets yet. Create your first one!
                  </li>
                )}
              </ul>
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
