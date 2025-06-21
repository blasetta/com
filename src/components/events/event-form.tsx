'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { EventSchema, type Event, type EventFormValues } from '@/firebase/models';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      eventDateTime: event?.eventDateTime.toDate() || new Date(),
      location: event?.location || '',
      imageURL: event?.imageURL || '',
      attendeeLimit: event?.attendeeLimit ?? null,
      isRecurring: event?.isRecurring || false,
    },
  });

  const onSubmit = async (values: EventFormValues) => {
    if (!firestore) return;

    try {
      const dataToSave = {
        ...values,
        eventDateTime: Timestamp.fromDate(values.eventDateTime),
        updatedAt: serverTimestamp(),
      };

      if (event) {
        // Update existing event
        const eventRef = doc(firestore, 'events', event.id);
        await setDoc(eventRef, { ...dataToSave, createdAt: event.createdAt }, { merge: true });
        toast({ title: 'Success', description: 'Event updated successfully.' });
      } else {
        // Create new event
        const collectionRef = collection(firestore, 'events');
        await addDoc(collectionRef, { ...dataToSave, createdAt: serverTimestamp() });
        toast({ title: 'Success', description: 'Event created successfully.' });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving event: ', error);
      toast({ title: 'Error', description: 'Failed to save the event.', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Community Meetup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of the event..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="eventDateTime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Event Date & Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Online or Street Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="attendeeLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attendee Limit (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="50"
                  {...field}
                  value={field.value ?? ''}
                  onChange={e => {
                    const num = parseInt(e.target.value, 10);
                    field.onChange(isNaN(num) ? null : num);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Recurring Training</FormLabel>
              </div>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Event'}
        </Button>
      </form>
    </Form>
  );
}
