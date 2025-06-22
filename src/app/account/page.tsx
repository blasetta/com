'use client';

import { useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const { userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);
  
  const handleNewsletterToggle = async (checked: boolean) => {
    if (!user || !firestore) return;
    const userDocRef = doc(firestore, 'users', user.uid);
    try {
      await updateDoc(userDocRef, { newsletterSub: checked });
      toast({
        title: 'Settings Updated',
        description: `You have ${checked ? 'subscribed to' : 'unsubscribed from'} the newsletter.`,
      });
    } catch (error) {
      console.error('Failed to update newsletter status:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update your newsletter settings.',
        variant: 'destructive',
      });
    }
  };

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="container py-12">
        <Skeleton className="h-48 w-full max-w-2xl mx-auto" />
      </div>
    );
  }

  if (!user || !userProfile) {
    return null; // or a message indicating profile not found
  }

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={userProfile.photoURL ?? undefined} />
              <AvatarFallback>{userProfile.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl font-headline">{userProfile.displayName}</CardTitle>
              <CardDescription>{userProfile.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <h3 className="font-medium font-headline">Account Details</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Role:</strong> <span className="capitalize">{userProfile.role}</span></p>
              <p><strong>Member Since:</strong> {userProfile.createdAt?.toDate()?.toLocaleDateString()}</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium font-headline">Settings</h3>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="newsletter-switch" className="text-base">Newsletter Subscription</Label>
                <p className="text-sm text-muted-foreground">
                  Receive our latest news, events, and updates directly to your inbox.
                </p>
              </div>
              <Switch
                id="newsletter-switch"
                checked={userProfile.newsletterSub}
                onCheckedChange={handleNewsletterToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
