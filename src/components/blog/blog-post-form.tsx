'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BlogPostSchema, type BlogPost, type BlogPostFormValues } from '@/firebase/models';
import { useFirestore } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface BlogPostFormProps {
  post?: BlogPost | null;
  onSuccess: () => void;
}

export function BlogPostForm({ post, onSuccess }: BlogPostFormProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(BlogPostSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      externalURL: post?.externalURL || '',
      imageURL: post?.imageURL || '',
    },
  });

  const onSubmit = async (values: BlogPostFormValues) => {
    if (!firestore) return;

    try {
      const dataToSave = {
        ...values,
        updatedAt: serverTimestamp(),
      };

      if (post) {
        // Update existing post
        const postRef = doc(firestore, 'blogPosts', post.id);
        await setDoc(postRef, { ...dataToSave, createdAt: post.createdAt }, { merge: true });
        toast({ title: 'Success', description: 'Blog post updated successfully.' });
      } else {
        // Create new post
        const collectionRef = collection(firestore, 'blogPosts');
        await addDoc(collectionRef, { ...dataToSave, createdAt: serverTimestamp() });
        toast({ title: 'Success', description: 'Blog post created successfully.' });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving blog post: ', error);
      toast({ title: 'Error', description: 'Failed to save the blog post.', variant: 'destructive' });
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
                <Input placeholder="My Awesome Post" {...field} />
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
              <FormLabel>Content / Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A short summary of the post..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="externalURL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>External URL</FormLabel>
              <FormControl>
                <Input placeholder="https://my-blog.com/post-slug" {...field} />
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
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Post'}
        </Button>
      </form>
    </Form>
  );
}
