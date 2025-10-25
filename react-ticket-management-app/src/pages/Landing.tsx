import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CheckCircle, Clock, Users, Zap } from 'lucide-react';
import waveSvgUrl from '../../../assets/wave.svg?url';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Wavy Background */}
        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
          {/* Wavy Background SVG */}
          <div className="absolute bottom-0 left-0 right-0">
            <img src={waveSvgUrl} alt="Wave background" className="w-full h-auto" />
          </div>

          {/* Decorative Circles */}
          <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute top-40 left-20 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl"></div>

          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-white mb-6 text-6xl">
                Streamline Your Support with TicketFlex
              </h1>
              <p className="text-white/90 text-lg mb-12 ">
                The ultimate ticket management system for modern teams. <br/> Track, manage, and resolve customer issues with ease.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 md:gap-10 justify-center">
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/auth/signup')}
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  onClick={() => navigate('/auth/login')}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-slate-50">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="mb-4">Why Choose TicketFlex?</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Everything you need to manage customer support tickets efficiently and effectively.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="mb-2">Lightning Fast</h3>
                <p className="text-slate-600 text-sm">
                  Create and manage tickets in seconds with our intuitive interface.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="mb-2">Track Progress</h3>
                <p className="text-slate-600 text-sm">
                  Monitor ticket status from open to resolved with real-time updates.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="mb-2">Team Collaboration</h3>
                <p className="text-slate-600 text-sm">
                  Work together seamlessly to resolve customer issues faster.
                </p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="mb-2">Save Time</h3>
                <p className="text-slate-600 text-sm">
                  Automate workflows and reduce response times dramatically.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section with Decorative Circle */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-100 rounded-full opacity-50"></div>
          
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Card className="p-8 md:p-12 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-white mb-4">
                  Ready to Transform Your Support?
                </h2>
                <p className="text-white/90 mb-8 text-lg">
                  Join thousands of teams already using TicketFlex to deliver exceptional customer support.
                </p>
                <Button 
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate('/auth/signup')}
                >
                  Start Managing Tickets Now
                </Button>
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
