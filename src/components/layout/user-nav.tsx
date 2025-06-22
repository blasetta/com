'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { useUserProfile } from '@/hooks/use-user-profile';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, LogOut, User as UserIcon, CalendarPlus, FilePlus } from 'lucide-react';
import { useAuthHandler } from '@/firebase/auth/use-auth-handler';

export function UserNav() {
  const { user, isUserLoading } = useUser();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const auth = useAuth();
  const router = useRouter();
  
  useAuthHandler();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isUserLoading || (user && isProfileLoading)) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map((n) => n[0]).join('');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Account</span>
            </Link>
          </DropdownMenuItem>
          {userProfile?.role === 'admin' && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/events?createNew=true">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  <span>New Event</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/admin/blog?createNew=true">
                  <FilePlus className="mr-2 h-4 w-4" />
                  <span>New Blog Post</span>
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
