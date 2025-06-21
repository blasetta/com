'use client';

import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AuthCheckProps {
  children: ReactNode;
  adminOnly?: boolean;
}

export default function AuthCheck({ children, adminOnly = false }: AuthCheckProps) {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  const isAuthorized = adminOnly ? userProfile?.role !== 'xadmin' : !!user;

  if (!isAuthorized) {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <CardTitle className="text-2xl text-destructive font-headline">Access Denied</CardTitle>
                    <CardDescription>
                        {adminOnly ? "You do not have permission to view this page." : "Please log in to continue."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => router.push('/')}>Go to Homepage</Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return <>{children}</>;
}
