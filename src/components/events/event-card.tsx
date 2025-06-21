import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Tag } from 'lucide-react';
import type { Event } from '@/firebase/models';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = event.eventDateTime.toDate();
  const imageUrl = event.imageURL || 'https://placehold.co/600x400.png';

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="p-0 relative">
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            data-ai-hint="tech event conference"
          />
        </div>
        {event.isRecurring && (
          <Badge className="absolute top-4 right-4" variant="default">
            <Tag className="mr-1 h-3 w-3" /> Training
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-1 p-6 space-y-4">
        <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>{eventDate.toLocaleString('it-IT', { dateStyle: 'full', timeStyle: 'short' })}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            <span>{event.location}</span>
          </div>
        </div>
        <p className="text-sm leading-relaxed">{event.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button asChild className="w-full">
          {/* This should ideally link to an external registration page */}
          <Link href="#">
            Learn More & Subscribe
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
