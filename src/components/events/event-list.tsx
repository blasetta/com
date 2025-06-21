'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, where, Timestamp } from 'firebase/firestore';
import { EventCard } from './event-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Event } from '@/firebase/models';

interface EventListProps {
  type: 'upcoming' | 'past';
}

export function EventList({ type }: EventListProps) {
  const firestore = useFirestore();
  
  const eventsQuery = useMemo(() => {
    if (!firestore) return null;
    const now = Timestamp.now();
    const operator = type === 'upcoming' ? '>=' : '<';
    return query(
        collection(firestore, 'events'), 
        where('eventDateTime', operator, now),
        orderBy('eventDateTime', type === 'upcoming' ? 'asc' : 'desc')
    );
  }, [firestore, type]);

  const { data: events, isLoading, error } = useCollection<Event>(eventsQuery);

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
    return <p className="text-center text-muted-foreground">No {type} events found.</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
