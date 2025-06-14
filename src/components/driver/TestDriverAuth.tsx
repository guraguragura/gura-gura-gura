
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TestDriverAuth = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCreatingTestUser, setIsCreatingTestUser] = useState(false);

  const createTestDriverUser = async () => {
    setIsCreatingTestUser(true);
    try {
      // Create a test user in auth
      const testEmail = 'test.driver@gura.com';
      const testPassword = 'testdriver123';
      
      console.log('Creating test driver user...');
      
      // First try to sign in with existing test user
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (signInError && signInError.message.includes('Invalid login credentials')) {
        // User doesn't exist, create new test user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: testEmail,
          password: testPassword,
          options: {
            data: {
              first_name: 'Test',
              last_name: 'Driver',
              user_type: 'driver'
            }
          }
        });

        if (signUpError) {
          console.error('Error creating test user:', signUpError);
          throw signUpError;
        }

        if (signUpData.user) {
          // Create driver profile for test user
          const { error: profileError } = await supabase
            .from('driver_profiles')
            .upsert({
              user_id: signUpData.user.id,
              first_name: 'Test',
              last_name: 'Driver',
              phone: '+250788999000',
              email: testEmail,
              vehicle_type: 'motorbike',
              is_active: true,
              is_available: true,
              driver_license: 'TEST001',
              current_location: {
                lat: -1.9441,
                lng: 30.0619,
                address: 'Test Location, Kigali'
              },
              metadata: {
                rating: 5.0,
                total_deliveries: 0
              }
            });

          if (profileError) {
            console.error('Error creating driver profile:', profileError);
            throw profileError;
          }

          toast({
            title: "Success",
            description: "Test driver user created and signed in!",
          });
        }
      } else if (signInData.user) {
        // User exists and signed in successfully
        toast({
          title: "Success",
          description: "Signed in as test driver!",
        });
      } else if (signInError) {
        throw signInError;
      }

    } catch (error) {
      console.error('Error with test driver authentication:', error);
      toast({
        title: "Error",
        description: "Failed to create/sign in test driver",
        variant: "destructive"
      });
    } finally {
      setIsCreatingTestUser(false);
    }
  };

  const signOutTestUser = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Driver Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            {user ? (
              <>Currently signed in as: <strong>{user.email}</strong></>
            ) : (
              'Sign in as a test driver to access the dashboard functionality.'
            )}
          </p>
          
          <div className="flex space-x-2">
            {!user ? (
              <Button 
                onClick={createTestDriverUser} 
                disabled={isCreatingTestUser}
                className="bg-green-600 hover:bg-green-700"
              >
                {isCreatingTestUser ? 'Creating...' : 'Sign In as Test Driver'}
              </Button>
            ) : (
              <Button 
                onClick={signOutTestUser}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Sign Out
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestDriverAuth;
