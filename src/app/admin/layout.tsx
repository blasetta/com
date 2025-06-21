'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AuthCheck from '@/components/auth/auth-check';
import { cn } from '@/lib/utils';
import { BarChart, Edit3, Newspaper, Users } from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart },
  { href: '/admin/events', label: 'Manage Events', icon: Edit3 },
  { href: '/admin/blog', label: 'Manage Blog', icon: Newspaper },
  { href: '/admin/users', label: 'Manage Users', icon: Users },
  { href: '/admin/newsletter', label: 'Create Newsletter', icon: Newspaper },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AuthCheck adminOnly>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:space-x-8">
          <aside className="md:w-1/4 lg:w-1/5">
            <h2 className="text-xl font-bold font-headline mb-4">Admin Menu</h2>
            <nav className="flex flex-col space-y-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 mt-8 md:mt-0">{children}</main>
        </div>
      </div>
    </AuthCheck>
  );
}
