
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DriverProfile } from '@/hooks/useDriverProfile';

interface VehicleTabProps {
  driverProfile: DriverProfile;
  updating: boolean;
  isEditingVehicle: boolean;
  setIsEditingVehicle: (editing: boolean) => void;
  onUpdateProfile: (updates: Partial<DriverProfile>) => Promise<boolean>;
}

const VehicleTab = ({ 
  driverProfile, 
  updating, 
  isEditingVehicle, 
  setIsEditingVehicle, 
  onUpdateProfile 
}: VehicleTabProps) => {
  const [vehicleData, setVehicleData] = useState({
    vehicle_make: driverProfile.vehicle_make || '',
    vehicle_model: driverProfile.vehicle_model || '',
    vehicle_year: driverProfile.vehicle_year?.toString() || '',
    plate_number: driverProfile.plate_number || '',
    vehicle_color: driverProfile.vehicle_color || ''
  });

  React.useEffect(() => {
    setVehicleData({
      vehicle_make: driverProfile.vehicle_make || '',
      vehicle_model: driverProfile.vehicle_model || '',
      vehicle_year: driverProfile.vehicle_year?.toString() || '',
      plate_number: driverProfile.plate_number || '',
      vehicle_color: driverProfile.vehicle_color || ''
    });
  }, [driverProfile]);

  const handleSaveVehicle = async () => {
    const success = await onUpdateProfile({
      ...vehicleData,
      vehicle_year: vehicleData.vehicle_year ? parseInt(vehicleData.vehicle_year) : undefined
    });
    if (success) {
      setIsEditingVehicle(false);
    }
  };

  return (
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
  );
};

export default VehicleTab;
