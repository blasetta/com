import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline">
          Welcome to <span className="text-primary">ComTech Hub Roma</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          Your central point for technology, community, and innovation in Rome. Discover events, read insightful articles, and connect with fellow tech enthusiasts.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/events">
              Explore Events <ArrowRight className="ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/blog">
              Read Our Blog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
