
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { User, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { DriverProfile } from '@/hooks/useDriverProfile';
import type { RatingStats } from '@/hooks/useDriverRatings';

interface ProfileTabProps {
  driverProfile: DriverProfile;
  ratingStats: RatingStats;
  updating: boolean;
  onUpdateProfile: (updates: Partial<DriverProfile>) => Promise<boolean>;
  onSignOut: () => void;
}

const ProfileTab = ({ 
  driverProfile, 
  ratingStats, 
  updating, 
  onUpdateProfile, 
  onSignOut 
}: ProfileTabProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: driverProfile.first_name || '',
    last_name: driverProfile.last_name || '',
    phone: driverProfile.phone || '',
    email: driverProfile.email || user?.email || '',
    address: driverProfile.address || '',
    emergency_contact: driverProfile.emergency_contact || ''
  });

  React.useEffect(() => {
    setFormData({
      first_name: driverProfile.first_name || '',
      last_name: driverProfile.last_name || '',
      phone: driverProfile.phone || '',
      email: driverProfile.email || user?.email || '',
      address: driverProfile.address || '',
      emergency_contact: driverProfile.emergency_contact || ''
    });
  }, [driverProfile, user]);

  const handleSaveProfile = async () => {
    const success = await onUpdateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  return (
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
          <Button variant="destructive" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTab;
