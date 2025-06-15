
import React from 'react';
import DriverProfileTabs from '@/components/driver/profile/DriverProfileTabs';
import { useDriverProfile } from '@/hooks/useDriverProfile';

const DriverProfile = () => {
  const { loading: profileLoading } = useDriverProfile();

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#84D1D3] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading driver profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
        </div>

        <DriverProfileTabs />
      </div>
    </div>
  );
};

export default DriverProfile;
