'use client';
import { NewsletterForm } from '@/components/newsletter/newsletter-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateNewsletterPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">Create Newsletter</h1>
            <Card>
                <CardHeader>
                    <CardTitle>New Newsletter</CardTitle>
                    <CardDescription>
                        Compose a new newsletter to be saved. The sending process is handled separately.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <NewsletterForm />
                </CardContent>
            </Card>
        </div>
    )
}
