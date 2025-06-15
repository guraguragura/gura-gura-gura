
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh: () => void;
  refreshing?: boolean;
}

const DashboardHeader = ({ onRefresh, refreshing = false }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your deliveries and track your progress</p>
      </div>
      <Button 
        onClick={onRefresh} 
        disabled={refreshing}
        variant="outline"
        className="flex items-center space-x-2"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
      </Button>
    </div>
  );
};

export default DashboardHeader;
