'use client';
import { EventList } from '@/components/events/event-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EventsPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Community Events
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Join our training sessions, one-shot events, and connect with the community.
        </p>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-96 md:mx-auto">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-8">
          <EventList type="upcoming" />
        </TabsContent>
        <TabsContent value="past" className="mt-8">
          <EventList type="past" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
