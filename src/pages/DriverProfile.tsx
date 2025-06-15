import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { User, Phone, Mail, MapPin, Car, Star, Settings, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDriverProfile } from '@/hooks/useDriverProfile';
import { useDriverRatings } from '@/hooks/useDriverRatings';
import { useDriverEarnings } from '@/hooks/useDriverEarnings';
import { RatingStats } from '@/components/driver/RatingStats';
import { useCurrency } from '@/hooks/useCurrency';

const DriverProfile = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { driverProfile, loading: profileLoading, updateDriverProfile, updating, refreshStatistics } = useDriverProfile();
  const { stats: ratingStats, ratings, loading: ratingsLoading } = useDriverRatings(driverProfile?.id);
  const { earnings, formattedEarnings } = useDriverEarnings(driverProfile?.id);
  const { formatPrice } = useCurrency();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    address: '',
    emergency_contact: ''
  });
  const [vehicleData, setVehicleData] = useState({
    vehicle_make: '',
    vehicle_model: '',
    vehicle_year: '',
    plate_number: '',
    vehicle_color: ''
  });

  // Handle opening vehicle tab from navigation state
  useEffect(() => {
    if (location.state?.openVehicleTab) {
      setActiveTab('vehicle');
      setIsEditingVehicle(true);
    }
  }, [location.state]);

  React.useEffect(() => {
    if (driverProfile) {
      setFormData({
        first_name: driverProfile.first_name || '',
        last_name: driverProfile.last_name || '',
        phone: driverProfile.phone || '',
        email: driverProfile.email || user?.email || '',
        address: driverProfile.address || '',
        emergency_contact: driverProfile.emergency_contact || ''
      });
      setVehicleData({
        vehicle_make: driverProfile.vehicle_make || '',
        vehicle_model: driverProfile.vehicle_model || '',
        vehicle_year: driverProfile.vehicle_year?.toString() || '',
        plate_number: driverProfile.plate_number || '',
        vehicle_color: driverProfile.vehicle_color || ''
      });
    }
  }, [driverProfile, user]);

  const handleSaveProfile = async () => {
    const success = await updateDriverProfile({
      ...formData,
      vehicle_year: vehicleData.vehicle_year ? parseInt(vehicleData.vehicle_year) : undefined
    });
    if (success) {
      setIsEditing(false);
    }
  };

  const handleSaveVehicle = async () => {
    const success = await updateDriverProfile({
      ...vehicleData,
      vehicle_year: vehicleData.vehicle_year ? parseInt(vehicleData.vehicle_year) : undefined
    });
    if (success) {
      setIsEditingVehicle(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="ratings">Ratings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    disabled={updating}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-[#84D1D3] rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {driverProfile.first_name} {driverProfile.last_name}
                    </h3>
                    <p className="text-gray-600">Gura Driver</p>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm">
                        {ratingStats.average_rating ? ratingStats.average_rating.toFixed(1) : 'No ratings yet'} 
                        {ratingStats.total_ratings > 0 && ` (${ratingStats.total_ratings} ratings)`}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Enter your address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergency_contact}
                        onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button 
                      className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
                      onClick={handleSaveProfile}
                      disabled={updating}
                    >
                      {updating ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="flex justify-end">
                  <Button variant="destructive" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicle" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Vehicle Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingVehicle(!isEditingVehicle)}
                    disabled={updating}
                  >
                    {isEditingVehicle ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Make</Label>
                      {isEditingVehicle ? (
                        <Input
                          value={vehicleData.vehicle_make}
                          onChange={(e) => setVehicleData({ ...vehicleData, vehicle_make: e.target.value })}
                          placeholder="Enter vehicle make"
                        />
                      ) : (
                        <p className="text-lg">{driverProfile.vehicle_make || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Model</Label>
                      {isEditingVehicle ? (
                        <Input
                          value={vehicleData.vehicle_model}
                          onChange={(e) => setVehicleData({ ...vehicleData, vehicle_model: e.target.value })}
                          placeholder="Enter vehicle model"
                        />
                      ) : (
                        <p className="text-lg">{driverProfile.vehicle_model || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Year</Label>
                      {isEditingVehicle ? (
                        <Input
                          type="number"
                          value={vehicleData.vehicle_year}
                          onChange={(e) => setVehicleData({ ...vehicleData, vehicle_year: e.target.value })}
                          placeholder="Enter vehicle year"
                        />
                      ) : (
                        <p className="text-lg">{driverProfile.vehicle_year || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Plate Number</Label>
                      {isEditingVehicle ? (
                        <Input
                          value={vehicleData.plate_number}
                          onChange={(e) => setVehicleData({ ...vehicleData, plate_number: e.target.value })}
                          placeholder="Enter plate number"
                        />
                      ) : (
                        <p className="text-lg font-mono">{driverProfile.plate_number || 'Not specified'}</p>
                      )}
                    </div>
                    <div>
                      <Label>Color</Label>
                      {isEditingVehicle ? (
                        <Input
                          value={vehicleData.vehicle_color}
                          onChange={(e) => setVehicleData({ ...vehicleData, vehicle_color: e.target.value })}
                          placeholder="Enter vehicle color"
                        />
                      ) : (
                        <p className="text-lg">{driverProfile.vehicle_color || 'Not specified'}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {isEditingVehicle && (
                  <div className="mt-6 flex space-x-2">
                    <Button 
                      className="bg-[#84D1D3] hover:bg-[#6bb6b9]"
                      onClick={handleSaveVehicle}
                      disabled={updating}
                    >
                      {updating ? 'Saving...' : 'Save Vehicle Info'}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditingVehicle(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Delivery Statistics</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={refreshStatistics}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Deliveries:</span>
                    <span className="font-semibold">{driverProfile.total_deliveries || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">
                        {ratingStats.average_rating ? ratingStats.average_rating.toFixed(1) : 'No ratings'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>Years Active:</span>
                    <span className="font-semibold">{driverProfile.years_active || 0} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-time Delivery:</span>
                    <span className="font-semibold">{driverProfile.on_time_percentage || 0}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Earnings:</span>
                    <span className="font-semibold">{formatPrice(driverProfile.total_earnings || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-semibold">{formattedEarnings.month}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week:</span>
                    <span className="font-semibold">{formattedEarnings.week}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today:</span>
                    <span className="font-semibold">{formattedEarnings.today}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ratings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RatingStats
                averageRating={ratingStats.average_rating}
                totalRatings={ratingStats.total_ratings}
                ratingDistribution={ratingStats.rating_distribution}
                showDetailed
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  {ratingsLoading ? (
                    <p className="text-gray-500">Loading reviews...</p>
                  ) : ratings.length === 0 ? (
                    <p className="text-gray-500">No reviews yet</p>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {ratings.slice(0, 10).map((rating) => (
                        <div key={rating.id} className="border-b pb-3 last:border-b-0">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= rating.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(rating.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.comment && (
                            <p className="text-sm text-gray-700 mb-1">{rating.comment}</p>
                          )}
                          <p className="text-xs text-gray-500">
                            {rating.customer?.first_name} {rating.customer?.last_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DriverProfile;
