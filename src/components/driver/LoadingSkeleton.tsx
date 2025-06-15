
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const OrderCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>
    <CardContent className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex space-x-2 pt-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardContent>
  </Card>
);

export const DashboardStatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const OrderListSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <OrderCardSkeleton key={i} />
    ))}
  </div>
);
