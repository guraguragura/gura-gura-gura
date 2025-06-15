
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type LoginFormProps = {
  error: string | null;
  setError: (error: string | null) => void;
};

const LoginForm = ({ error, setError }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });

      if (error) {
        setError(error.message || 'Failed to send verification code');
      } else {
        setStep('otp');
        toast.success("Verification code sent to your phone");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: 'sms',
      });

      if (error) {
        setError(error.message || 'Invalid verification code');
      } else {
        toast.success("Successfully signed in");
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError(null);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-semibold mb-1">Driver Sign In</h1>
        <p className="text-xs md:text-sm text-gray-600">
          {step === 'phone' ? 
            'Enter your phone number to receive a verification code' :
            'Enter the verification code sent to your phone'
          }
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-2 md:p-3 rounded-md mb-4 text-xs md:text-sm">
          {error}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
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
                placeholder="+250788123456" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-8 md:pl-10 text-xs md:text-sm h-9 md:h-10"
                required
              />
            </div>
            <p className="text-xs text-gray-500">
              Use Victor's number: +250788123456
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-[#84D1D3] hover:bg-[#6bb6b9] text-white mt-4 h-9 md:h-10 text-xs md:text-sm" 
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div className="space-y-1 md:space-y-2">
            <label htmlFor="otp" className="block text-xs md:text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <div className="flex justify-center">
              <InputOTP
                value={otp}
                onChange={setOtp}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Enter the 6-digit code sent to {phone}
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              type="submit" 
              className="w-full bg-[#84D1D3] hover:bg-[#6bb6b9] text-white h-9 md:h-10 text-xs md:text-sm" 
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleBackToPhone}
              className="w-full h-9 md:h-10 text-xs md:text-sm"
            >
              Back to Phone Number
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
