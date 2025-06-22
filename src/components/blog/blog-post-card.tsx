import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';
import type { BlogPost } from '@/firebase/models';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const snippet = post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content;
  const imageUrl = post.imageURL || 'https://placehold.co/600x400.png';

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="p-0">
        <div className="aspect-video relative">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint="tech community blog"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <CardTitle className="font-headline text-xl mb-2">{post.title}</CardTitle>
        <p className="text-muted-foreground text-sm">{snippet}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-end">
        {post.externalURL ? (
          <Button asChild size="icon" className="rounded-full">
            <Link href={post.externalURL} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight className="h-4 w-4" />
              <span className="sr-only">Read More</span>
            </Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
