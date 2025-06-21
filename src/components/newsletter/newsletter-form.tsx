'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { NewsletterSchema, type NewsletterFormValues } from '@/firebase/models';
import { useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export function NewsletterForm() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const onSubmit = async (values: NewsletterFormValues) => {
    if (!firestore) return;

    try {
      const collectionRef = collection(firestore, 'newsletters');
      await addDoc(collectionRef, {
        ...values,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Success', description: 'Newsletter has been saved.' });
      form.reset();
    } catch (error) {
      console.error('Error saving newsletter: ', error);
      toast({ title: 'Error', description: 'Failed to save the newsletter.', variant: 'destructive' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Newsletter Title</FormLabel>
              <FormControl>
                <Input placeholder="Weekly Tech Roundup" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your newsletter content here..." {...field} rows={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Newsletter'}
        </Button>
      </form>
    </Form>
  );
}
