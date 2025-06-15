import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { User, Phone, Mail, MapPin, Car, Star, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDriverProfile } from '@/hooks/useDriverProfile';
import { useDriverRatings } from '@/hooks/useDriverRatings';
import { RatingStats } from '@/components/driver/RatingStats';

const DriverProfile = () => {
  const { user, signOut } = useAuth();
  const { driverProfile } = useDriverProfile();
  const { stats: ratingStats, ratings, loading: ratingsLoading } = useDriverRatings(driverProfile?.id);
  const [isEditing, setIsEditing] = useState(false);

  const driverStats = {
    totalDeliveries: 1247,
    totalEarnings: 'RWF 2,450,000',
    yearsActive: 2
  };

  const vehicleInfo = {
    make: 'Toyota',
    model: 'Hiace',
    year: '2019',
    plateNumber: 'RAD 123C',
    color: 'White'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
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
                      {driverProfile?.first_name} {driverProfile?.last_name}
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
                        defaultValue={driverProfile?.first_name || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue={driverProfile?.last_name || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        defaultValue={driverProfile?.phone || ''}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        defaultValue={driverProfile?.email || user?.email || ''}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        defaultValue="Kigali, Rwanda"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        defaultValue="+250 788 654 321"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex space-x-2 pt-4">
                    <Button className="bg-[#84D1D3] hover:bg-[#6bb6b9]">
                      Save Changes
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
                <CardTitle>Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Make</Label>
                      <p className="text-lg">{vehicleInfo.make}</p>
                    </div>
                    <div>
                      <Label>Model</Label>
                      <p className="text-lg">{vehicleInfo.model}</p>
                    </div>
                    <div>
                      <Label>Year</Label>
                      <p className="text-lg">{vehicleInfo.year}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Plate Number</Label>
                      <p className="text-lg font-mono">{vehicleInfo.plateNumber}</p>
                    </div>
                    <div>
                      <Label>Color</Label>
                      <p className="text-lg">{vehicleInfo.color}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button variant="outline">
                    <Car className="mr-2 h-4 w-4" />
                    Update Vehicle Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Deliveries:</span>
                    <span className="font-semibold">{driverStats.totalDeliveries}</span>
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
                    <span className="font-semibold">{driverStats.yearsActive} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>On-time Delivery:</span>
                    <span className="font-semibold">96%</span>
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
                    <span className="font-semibold">{driverStats.totalEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month:</span>
                    <span className="font-semibold">RWF 185,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week:</span>
                    <span className="font-semibold">RWF 42,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Today:</span>
                    <span className="font-semibold">RWF 8,500</span>
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
