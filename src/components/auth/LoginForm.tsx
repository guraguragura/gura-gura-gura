
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type LoginFormProps = {
  error: string | null;
  setError: (error: string | null) => void;
};

const LoginForm = ({ error, setError }: LoginFormProps) => {
  const { signInWithPhone } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signInWithPhone(phone, password);

      if (result.error) {
        setError(result.error.message || 'Failed to sign in. Please check your credentials.');
      } else {
        toast.success("Successfully signed in");
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Driver Sign In</h1>
        <p className="text-xs md:text-sm text-gray-600">
          Welcome back! Please sign in to your driver account
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-2 md:p-3 rounded-md mb-4 text-xs md:text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1 md:space-y-2">
          <label htmlFor="phone" className="block text-xs md:text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Phone className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+250 XXX XXX XXX" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-8 md:pl-10 text-xs md:text-sm h-9 md:h-10"
              required
            />
          </div>
        </div>

        <div className="space-y-1 md:space-y-2">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700">
              Password
            </label>
            <Link to="/auth/forgot-password" className="text-xs text-gray-500 hover:underline">
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Lock className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </span>
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-8 md:pl-10 pr-10 text-xs md:text-sm h-9 md:h-10"
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <EyeOff className="h-3.5 w-3.5 md:h-4 md:w-4" /> : 
                <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
              }
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-me" 
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="h-3.5 w-3.5 md:h-4 md:w-4"
            />
            <label htmlFor="remember-me" className="text-xs md:text-sm text-gray-600 cursor-pointer">
              Remember me
            </label>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-[#84D1D3] hover:bg-[#6bb6b9] text-white mt-4 h-9 md:h-10 text-xs md:text-sm" 
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
