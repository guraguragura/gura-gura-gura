
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, TrendingUp } from 'lucide-react';
import { useDriverProfile } from '@/hooks/useDriverProfile';

interface DashboardStatsProps {
  availableCount: number;
  activeCount: number;
}

const DashboardStats = ({ availableCount, activeCount }: DashboardStatsProps) => {
  const { driverProfile } = useDriverProfile();

  const stats = [
    {
      title: 'Available Orders',
      value: availableCount.toString(),
      icon: Package,
      description: 'Ready for pickup'
    },
    {
      title: 'Active Deliveries',
      value: activeCount.toString(),
      icon: Truck,
      description: 'Currently assigned'
    },
    {
      title: 'Total Deliveries',
      value: (driverProfile?.total_deliveries || 0).toString(),
      icon: TrendingUp,
      description: 'Completed orders'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-[#84D1D3]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
