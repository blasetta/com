'use client';
import { useCollection, useFirestore } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Edit3, Newspaper, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const firestore = useFirestore();
  const { data: users, isLoading: usersLoading } = useCollection(firestore ? collection(firestore, 'users') : null);
  const { data: events, isLoading: eventsLoading } = useCollection(firestore ? collection(firestore, 'events') : null);
  const { data: blogPosts, isLoading: blogPostsLoading } = useCollection(firestore ? collection(firestore, 'blogPosts') : null);

  const stats = [
    {
      title: 'Total Users',
      value: users?.length,
      loading: usersLoading,
      icon: Users,
      link: '/admin/users'
    },
    {
      title: 'Total Events',
      value: events?.length,
      loading: eventsLoading,
      icon: Edit3,
      link: '/admin/events'
    },
    {
      title: 'Total Blog Posts',
      value: blogPosts?.length,
      loading: blogPostsLoading,
      icon: Newspaper,
      link: '/admin/blog'
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold font-headline mb-6">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {stat.loading ? (
                <Skeleton className="h-8 w-1/4" />
              ) : (
                <div className="text-2xl font-bold">{stat.value ?? 0}</div>
              )}
               <Button variant="link" asChild className="p-0 h-auto mt-2">
                <Link href={stat.link}>View All</Link>
               </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
