'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot } from 'lucide-react';
import { chat } from '@/ai/flows/chat-flow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function ChatInterface() {
    const { user } = useUser();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! How can I help you navigate the ComTech Hub today?"}
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const response = await chat(currentInput);
            const assistantMessage: Message = { role: 'assistant', content: response };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('Chat error:', error);
            let messageContent = 'Sorry, something went wrong. Please try again.';
            if (error.message && (error.message.includes('SERVICE_DISABLED') || error.message.includes('API has not been used') || error.message.includes('are blocked'))) {
                const projectIdMatch = error.message.match(/project(?:s\/|\s|=)(\d+)/);
                if (projectIdMatch && projectIdMatch[1]) {
                    const projectId = projectIdMatch[1];
                    const enableApiUrl = `https://console.developers.google.com/apis/api/generativelanguage.googleapis.com/overview?project=${projectId}`;
                    messageContent = `It looks like there's a permission issue with the Generative Language API. This might be due to API key restrictions or other settings in your Google Cloud project. Please [visit the API dashboard](${enableApiUrl}) to check its status and ensure it's configured correctly. It may take a few minutes for changes to apply.`;
                } else {
                    messageContent = "There seems to be a permission issue with the AI service. Please check the 'Generative Language API' settings in your Google Cloud project console."
                }
            }
            const errorMessage: Message = { role: 'assistant', content: messageContent };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name.split(' ').map((n) => n[0]).join('');
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="font-headline">Chat Assistant</CardTitle>
                <CardDescription>Ask me anything about the app!</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full pr-4">
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'flex items-start gap-4',
                                    message.role === 'user' ? 'justify-end' : 'justify-start'
                                )}
                            >
                                {message.role === 'assistant' && (
                                    <Avatar className="h-8 w-8 border">
                                        <AvatarFallback className="bg-background"><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        'max-w-prose rounded-lg p-3 text-sm prose dark:prose-invert prose-p:my-0 prose-a:text-primary hover:prose-a:text-primary/80',
                                        message.role === 'user'
                                            ? 'bg-primary text-primary-foreground prose-a:text-primary-foreground hover:prose-a:text-primary-foreground/80'
                                            : 'bg-muted'
                                    )}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer"/>,
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                                {message.role === 'user' && user && (
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.photoURL ?? ''} />
                                        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-4 justify-start">
                                <Avatar className="h-8 w-8 border">
                                    <AvatarFallback className="bg-background"><Bot className="h-5 w-5 text-primary"/></AvatarFallback>
                                </Avatar>
                                <div className="bg-muted rounded-lg p-3 text-sm">
                                    <div className="flex items-center space-x-1">
                                       <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                       <span className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                       <span className="h-2 w-2 bg-foreground rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <form onSubmit={handleSendMessage} className="mt-6 flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="e.g., How do I create a new blog post?"
                        disabled={isLoading}
                        autoFocus
                    />
                    <Button type="submit" disabled={isLoading} size="icon">
                        <Send />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
