
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from './ProfileTab';
import VehicleTab from './VehicleTab';
import StatsTab from './StatsTab';
import RatingsTab from './RatingsTab';
import { useAuth } from '@/contexts/AuthContext';
import { useDriverProfile } from '@/hooks/useDriverProfile';
import { useDriverRatings } from '@/hooks/useDriverRatings';
import { useDriverEarnings } from '@/hooks/useDriverEarnings';

const DriverProfileTabs = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const { driverProfile, updateDriverProfile, refreshStatistics, updating } = useDriverProfile();
  const { stats: ratingStats, ratings, loading: ratingsLoading } = useDriverRatings(driverProfile?.id);
  const { formattedEarnings } = useDriverEarnings(driverProfile?.id);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);

  // Handle opening vehicle tab from navigation state
  useEffect(() => {
    if (location.state?.openVehicleTab) {
      setActiveTab('vehicle');
      setIsEditingVehicle(true);
    }
  }, [location.state]);

  if (!driverProfile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Driver profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
        <TabsTrigger value="stats">Statistics</TabsTrigger>
        <TabsTrigger value="ratings">Ratings</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileTab
          driverProfile={driverProfile}
          ratingStats={ratingStats}
          updating={updating}
          onUpdateProfile={updateDriverProfile}
          onSignOut={signOut}
        />
      </TabsContent>

      <TabsContent value="vehicle" className="mt-6">
        <VehicleTab
          driverProfile={driverProfile}
          updating={updating}
          isEditingVehicle={isEditingVehicle}
          setIsEditingVehicle={setIsEditingVehicle}
          onUpdateProfile={updateDriverProfile}
        />
      </TabsContent>

      <TabsContent value="stats" className="mt-6">
        <StatsTab
          driverProfile={driverProfile}
          ratingStats={ratingStats}
          formattedEarnings={formattedEarnings}
          onRefreshStatistics={refreshStatistics}
        />
      </TabsContent>

      <TabsContent value="ratings" className="mt-6">
        <RatingsTab
          ratingStats={ratingStats}
          ratings={ratings}
          ratingsLoading={ratingsLoading}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DriverProfileTabs;
