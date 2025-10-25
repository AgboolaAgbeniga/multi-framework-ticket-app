import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { apiLogin } from '../lib/mockApi';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await apiLogin(email, password);
    setIsLoading(false);

    if (response.ok && response.data) {
      toast.success(`Welcome back, ${response.data.user.name}!`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } else {
      toast.error(response.error || 'Login failed');
      setErrors({ password: response.error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="mb-2">Welcome Back</h1>
              <p className="text-slate-600">
                Login to manage your tickets
              </p>
            </div>

            <Card className="p-6 sm:p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors(prev => ({ ...prev, password: undefined }));
                    }}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  {errors.password && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-slate-600">Don't have an account? </span>
                  <Link to="/auth/signup" className="text-indigo-600 hover:underline">
                    Sign up
                  </Link>
                </div>

                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="text-blue-900">
                    <strong>Demo Account:</strong><br />
                    Email: demo@ticketapp.com<br />
                    Password: demo123
                  </p>
                </div> */}
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
