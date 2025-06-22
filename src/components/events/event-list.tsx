'use client';

import { useMemo, useState } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { EventCard } from './event-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Event } from '@/firebase/models';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

interface EventListProps {
  type: 'upcoming' | 'past';
}

export function EventList({ type }: EventListProps) {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);
  const [now] = useState(() => Timestamp.now());
  
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    const operator = type === 'upcoming' ? '>=' : '<';
    return query(
        collection(firestore, 'events'), 
        where('eventDateTime', operator, now),
        orderBy('eventDateTime', type === 'upcoming' ? 'asc' : 'desc')
    );
  }, [firestore, type, now]);

  const { data: events, isLoading: areEventsLoading, error } = useCollection<Event>(eventsQuery);

  const isLoading = isUserLoading || isProfileLoading || areEventsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive">Error loading events. Please try again later.</p>;
  }
  
  if (!events || events.length === 0) {
    return (
        <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-muted-foreground">No {type} events found.</h3>
            <p className="mt-2 text-muted-foreground">Check back later for new events.</p>
            {userProfile?.role === 'admin' && (
            <Button asChild className="mt-4">
                <Link href="/admin/events?createNew=true">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a New Event
                </Link>
            </Button>
            )}
        </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
