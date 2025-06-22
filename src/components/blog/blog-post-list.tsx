'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { BlogPostCard } from './blog-post-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost } from '@/firebase/models';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export function BlogPostList() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile(user?.uid);

  const blogPostsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: blogPosts, isLoading: arePostsLoading, error } = useCollection<BlogPost>(blogPostsQuery);

  const isLoading = isUserLoading || isProfileLoading || arePostsLoading;

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive">Error loading blog posts. Please try again later.</p>;
  }
  
  if (!blogPosts || blogPosts.length === 0) {
    return (
        <div className="text-center py-10 border-2 border-dashed border-muted rounded-lg flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-muted-foreground">No Blog Posts Found</h3>
            <p className="mt-2 text-muted-foreground">It seems there are no articles here yet.</p>
            {userProfile?.role === 'admin' && (
            <Button asChild className="mt-4">
                <Link href="/admin/blog?createNew=true">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create a New Post
                </Link>
            </Button>
            )}
        </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
