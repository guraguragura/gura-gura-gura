
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TestDataHelper = () => {
  const { toast } = useToast();

  const createTestData = async () => {
    try {
      // Create customers
      const { error: customerError } = await supabase
        .from('customer')
        .upsert([
          {
            id: 'test_cust_001',
            first_name: 'Alice',
            last_name: 'Uwimana',
            email: 'alice.test@email.com',
            phone: '+250788111222',
            has_account: true
          },
          {
            id: 'test_cust_002',
            first_name: 'Bob',
            last_name: 'Kamanzi',
            email: 'bob.test@email.com',
            phone: '+250788222333',
            has_account: false
          },
          {
            id: 'test_cust_003',
            first_name: 'Grace',
            last_name: 'Mukandoli',
            email: 'grace.test@email.com',
            phone: '+250788333444',
            has_account: true
          }
        ]);

      if (customerError) throw customerError;

      // Create addresses
      const { error: addressError } = await supabase
        .from('order_address')
        .upsert([
          {
            id: 'test_addr_001',
            customer_id: 'test_cust_001',
            first_name: 'Alice',
            last_name: 'Uwimana',
            address_1: 'KN 15 Ave',
            address_2: 'House #45',
            city: 'Kigali',
            country_code: 'RW',
            phone: '+250788111222'
          },
          {
            id: 'test_addr_002',
            customer_id: 'test_cust_002',
            first_name: 'Bob',
            last_name: 'Kamanzi',
            address_1: 'KG 201 St',
            address_2: 'Apt 12B',
            city: 'Kigali',
            country_code: 'RW',
            phone: '+250788222333'
          },
          {
            id: 'test_addr_003',
            customer_id: 'test_cust_003',
            first_name: 'Grace',
            last_name: 'Mukandoli',
            address_1: 'KK 7 Ave',
            address_2: 'Villa 23',
            city: 'Kigali',
            country_code: 'RW',
            phone: '+250788333444'
          }
        ]);

      if (addressError) throw addressError;

      // Create orders
      const { error: orderError } = await supabase
        .from('order')
        .upsert([
          {
            id: 'test_order_001',
            customer_id: 'test_cust_001',
            shipping_address_id: 'test_addr_001',
            currency_code: 'RWF',
            email: 'alice.test@email.com',
            unified_status: 'ready_for_pickup',
            status: 'pending',
            metadata: {
              total_amount: 15000,
              items_count: 3,
              estimated_delivery_time: '25-30 mins',
              distance: '2.1 km'
            }
          },
          {
            id: 'test_order_002',
            customer_id: 'test_cust_002',
            shipping_address_id: 'test_addr_002',
            currency_code: 'RWF',
            email: 'bob.test@email.com',
            unified_status: 'ready_for_pickup',
            status: 'pending',
            metadata: {
              total_amount: 28500,
              items_count: 5,
              estimated_delivery_time: '30-35 mins',
              distance: '3.7 km'
            }
          },
          {
            id: 'test_order_003',
            customer_id: 'test_cust_003',
            shipping_address_id: 'test_addr_003',
            currency_code: 'RWF',
            email: 'grace.test@email.com',
            unified_status: 'ready_for_pickup',
            status: 'pending',
            metadata: {
              total_amount: 42000,
              items_count: 2,
              estimated_delivery_time: '20-25 mins',
              distance: '1.8 km'
            }
          }
        ]);

      if (orderError) throw orderError;

      toast({
        title: "Success",
        description: "Test data created successfully!",
      });

    } catch (error) {
      console.error('Error creating test data:', error);
      toast({
        title: "Error",
        description: "Failed to create test data",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Data Helper</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Click the button below to create test orders for the driver dashboard.
        </p>
        <Button onClick={createTestData} className="bg-blue-600 hover:bg-blue-700">
          Create Test Orders
        </Button>
      </CardContent>
    </Card>
  );
};

export default TestDataHelper;
