import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { getSession, logout } from '../../lib/auth';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const session = getSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="hover:opacity-80 transition-opacity"
            >
              <span className="text-indigo-600">TicketFlow</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/tickets')}
                >
                  Tickets
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">
                    {session.name}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth/login')}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => navigate('/auth/signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            {session ? (
              <div className="flex flex-col gap-2">
                <span className="px-3 py-2 text-sm text-slate-600">
                  {session.name}
                </span>
                <Button 
                  variant="ghost" 
                  className="justify-start"
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate('/tickets');
                    setMobileMenuOpen(false);
                  }}
                >
                  Tickets
                </Button>
                <Button 
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button 
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    navigate('/auth/login');
                    setMobileMenuOpen(false);
                  }}
                >
                  Login
                </Button>
                <Button
                  className="justify-start"
                  onClick={() => {
                    navigate('/auth/signup');
                    setMobileMenuOpen(false);
                  }}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
