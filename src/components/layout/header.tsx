'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserNav } from '@/components/layout/user-nav';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="https://storage.googleapis.com/gdgsite/gdg.svg"
              alt="ComTech Hub Roma Logo"
              width={150}
              height={26}
            />
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link
              href="/events"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Events
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Blog
            </Link>
            {/* <Link
              href="/chat"
              className="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
            >
               <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Link> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
