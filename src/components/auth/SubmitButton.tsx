
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type SubmitButtonProps = {
  isLoading: boolean;
  label: string;
  loadingLabel: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  label,
  loadingLabel
}) => {
  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </Button>
  );
};

export default SubmitButton;
