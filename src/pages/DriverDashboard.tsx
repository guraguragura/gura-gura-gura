
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Package, Clock, DollarSign } from 'lucide-react';

const DriverDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Active Deliveries',
      value: '3',
      icon: Package,
      description: 'Currently assigned'
    },
    {
      title: 'Completed Today',
      value: '12',
      icon: Truck,
      description: 'Deliveries completed'
    },
    {
      title: 'Hours Worked',
      value: '6.5',
      icon: Clock,
      description: 'Today'
    },
    {
      title: 'Earnings Today',
      value: 'RWF 45,000',
      icon: DollarSign,
      description: 'Total earnings'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.user_metadata?.first_name || 'Driver'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's your delivery overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Today's Deliveries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #1234</p>
                    <p className="text-sm text-gray-600">Kigali, Kimisagara</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                    In Progress
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #1235</p>
                    <p className="text-sm text-gray-600">Kigali, Nyamirambo</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    Pending
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm">Delivered order #1232 at 2:30 PM</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm">Picked up order #1233 at 1:45 PM</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm">Started shift at 8:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
