
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VerificationCodeDisplayProps {
  code: string;
  orderStatus: string;
}

export const VerificationCodeDisplay: React.FC<VerificationCodeDisplayProps> = ({
  code,
  orderStatus
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: "Verification code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Please manually copy the code",
        variant: "destructive"
      });
    }
  };

  if (orderStatus !== 'out_for_delivery') {
    return null;
  }

  return (
    <Card className="border-2 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Shield className="h-5 w-5" />
          Delivery Verification Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-blue-700 mb-3">
            Your driver is on the way! Please provide this code to confirm delivery:
          </p>
          
          <div className="bg-white border-2 border-blue-300 rounded-lg p-6 mb-4">
            <div className="text-4xl font-bold text-blue-600 tracking-wider">
              {code}
            </div>
          </div>
          
          <Button 
            onClick={handleCopyCode}
            variant="outline" 
            className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </>
            )}
          </Button>
        </div>
        
        <div className="bg-blue-100 border border-blue-200 rounded-md p-3">
          <p className="text-xs text-blue-800 text-center">
            🔒 This code ensures secure delivery. Do not share it with unauthorized persons.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
