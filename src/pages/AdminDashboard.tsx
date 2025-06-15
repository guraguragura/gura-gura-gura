
import React from 'react';
import OrderManagement from '@/components/admin/OrderManagement';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage orders, drivers, and system operations</p>
        </div>
        
        <OrderManagement />
      </div>
    </div>
  );
};

export default AdminDashboard;
