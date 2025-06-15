
import type { DriverOrder } from '@/hooks/useDriverOrders';

export const mockAvailableOrders: DriverOrder[] = [
  {
    id: 'mock_ord_001',
    customer_name: 'Alice Uwimana',
    customer_phone: '+250788123456',
    delivery_address: 'KN 15 St, Kigali Heights, Kacyiru',
    items_count: 3,
    total_amount: 'RWF 45,500',
    estimated_delivery_time: '20-25 mins',
    distance: '2.1 km',
    unified_status: 'ready_for_pickup',
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_ord_002',
    customer_name: 'Jean Baptiste Nkurunziza',
    customer_phone: '+250788234567',
    delivery_address: 'KG 201 St, Kimisagara, Nyarugenge',
    items_count: 1,
    total_amount: 'RWF 18,750',
    estimated_delivery_time: '15-20 mins',
    distance: '1.8 km',
    unified_status: 'ready_for_pickup',
    created_at: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_ord_003',
    customer_name: 'Marie Claire Ingabire',
    customer_phone: '+250788345678',
    delivery_address: 'KK 19 Ave, Remera, Gasabo',
    items_count: 5,
    total_amount: 'RWF 67,200',
    estimated_delivery_time: '30-35 mins',
    distance: '3.2 km',
    unified_status: 'ready_for_pickup',
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_ord_004',
    customer_name: 'David Muhire',
    customer_phone: '+250788456789',
    delivery_address: 'KN 78 St, Gisozi, Gasabo',
    items_count: 2,
    total_amount: 'RWF 32,100',
    estimated_delivery_time: '25-30 mins',
    distance: '2.7 km',
    unified_status: 'ready_for_pickup',
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
];

export const mockActiveOrders: DriverOrder[] = [
  {
    id: 'mock_ord_101',
    customer_name: 'Grace Mutesi',
    customer_phone: '+250788567890',
    delivery_address: 'KG 45 St, Muhima, Nyarugenge',
    items_count: 2,
    total_amount: 'RWF 28,900',
    estimated_delivery_time: '15-20 mins',
    distance: '1.5 km',
    unified_status: 'assigned_to_driver',
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_ord_102',
    customer_name: 'Paul Kagame Jr',
    customer_phone: '+250788678901',
    delivery_address: 'KK 12 Ave, Kacyiru, Gasabo',
    items_count: 1,
    total_amount: 'RWF 15,600',
    estimated_delivery_time: '10-15 mins',
    distance: '0.9 km',
    unified_status: 'picked_up',
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_ord_103',
    customer_name: 'Emmanuel Hategeka',
    customer_phone: '+250788789012',
    delivery_address: 'KN 34 St, Nyamirambo, Nyarugenge',
    items_count: 4,
    total_amount: 'RWF 52,300',
    estimated_delivery_time: '20-25 mins',
    distance: '2.3 km',
    unified_status: 'out_for_delivery',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

export const mockCompletedOrders: DriverOrder[] = [
  {
    id: 'mock_ord_201',
    customer_name: 'Immaculée Uwimana',
    customer_phone: '+250788890123',
    delivery_address: 'KG 67 St, Kigali City Market',
    items_count: 3,
    total_amount: 'RWF 41,750',
    estimated_delivery_time: '25-30 mins',
    distance: '2.8 km',
    unified_status: 'delivered',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock_ord_202',
    customer_name: 'Robert Niyonshuti',
    customer_phone: '+250788901234',
    delivery_address: 'KK 89 Ave, Nyarutarama, Gasabo',
    items_count: 1,
    total_amount: 'RWF 22,400',
    estimated_delivery_time: '20-25 mins',
    distance: '2.1 km',
    unified_status: 'delivered',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  }
];

// Unified export for data service compatibility
export const mockDriverOrders: DriverOrder[] = [
  ...mockAvailableOrders,
  ...mockActiveOrders,
  ...mockCompletedOrders
];
