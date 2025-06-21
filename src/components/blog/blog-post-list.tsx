'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { BlogPostCard } from './blog-post-card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost } from '@/firebase/models';

export function BlogPostList() {
  const firestore = useFirestore();
  const blogPostsQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'blogPosts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: blogPosts, isLoading, error } = useCollection<BlogPost>(blogPostsQuery);

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
    return <p className="text-center text-muted-foreground">No blog posts found.</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
