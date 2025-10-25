import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { toast } from 'sonner';
import { apiSignup } from '../lib/mockApi';
import { AlertCircle } from 'lucide-react';

export function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string; 
    confirmPassword?: string 
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string; 
      confirmPassword?: string 
    } = {};

    if (!name) {
      newErrors.name = 'Name is required';
    } else if (name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const response = await apiSignup(email, password, name);
    setIsLoading(false);

    if (response.ok) {
      toast.success('Account created successfully! Please log in.');
      setTimeout(() => {
        navigate('/auth/login');
      }, 500);
    } else {
      toast.error(response.error || 'Signup failed');
      setErrors({ email: response.error });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="mb-2">Create Account</h1>
              <p className="text-slate-600">
                Get started with TicketFlow today
              </p>
            </div>

            <Card className="p-6 sm:p-8 shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

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

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.confirmPassword}</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-slate-600">Already have an account? </span>
                  <Link to="/auth/login" className="text-indigo-600 hover:underline">
                    Login
                  </Link>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
