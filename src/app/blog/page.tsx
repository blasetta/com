'use client';
import { BlogPostList } from '@/components/blog/blog-post-list';

export default function BlogPage() {
  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
          Our Blog
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Insights, articles, and updates from the ComTech Hub Roma community.
        </p>
      </div>
      <BlogPostList />
    </div>
  );
}
