import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';

// User
export const UserSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  photoURL: z.string().url().nullable(),
  role: z.enum(['user', 'admin']).default('user'),
  newsletterSub: z.boolean().default(false),
  mailAdmin: z.boolean().default(false),
  createdAt: z.any(), // Using any for Firestore Timestamp
});

export type UserProfile = z.infer<typeof UserSchema> & {
  createdAt: Timestamp;
};

// BlogPost
export const BlogPostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  externalURL: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  imageURL: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type BlogPost = z.infer<typeof BlogPostSchema> & {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
export type BlogPostFormValues = z.infer<typeof BlogPostSchema>;


// Event
export const EventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  eventDateTime: z.date(),
  location: z.string().min(3, 'Location is required'),
  imageURL: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  attendeeLimit: z.number().positive().optional().nullable(),
  isRecurring: z.boolean().default(false),
});

export type Event = {
  id: string;
  title: string;
  description: string;
  eventDateTime: Timestamp;
  location: string;
  imageURL?: string;
  attendeeLimit?: number | null;
  isRecurring: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type EventFormValues = z.infer<typeof EventSchema>;


// Newsletter
export const NewsletterSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
});

export type Newsletter = {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
};

export type NewsletterFormValues = z.infer<typeof NewsletterSchema>;
