
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Car, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const DriverManagement = () => {
  const { data: drivers, isLoading, refetch } = useQuery({
    queryKey: ['admin-drivers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('driver_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-lg">Loading drivers...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
            <p className="text-gray-600 mt-2">Manage your delivery drivers</p>
          </div>
          <Link to="/admin/drivers/new">
            <Button className="bg-[#84D1D3] hover:bg-[#6bb6b9] flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Driver</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers?.map((driver) => (
            <Card key={driver.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {driver.first_name} {driver.last_name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant={driver.is_active ? 'default' : 'secondary'}>
                      {driver.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {driver.is_available && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{driver.email || 'No email'}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{driver.phone || 'No phone'}</span>
                </div>

                {driver.vehicle_make && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Car className="h-4 w-4" />
                    <span>{driver.vehicle_make} {driver.vehicle_model}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div>Deliveries: {driver.total_deliveries || 0}</div>
                  <div>Rating: {driver.average_rating ? `${driver.average_rating}/5` : 'N/A'}</div>
                </div>

                <div className="pt-2">
                  <Link to={`/admin/drivers/${driver.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!drivers || drivers.length === 0) && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500 mb-4">No drivers found</p>
              <Link to="/admin/drivers/new">
                <Button className="bg-[#84D1D3] hover:bg-[#6bb6b9]">
                  Add Your First Driver
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DriverManagement;
