import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
    return (
        <div className="container mx-auto max-w-3xl py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">
                    Smart Assistant
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Ask me anything about ComTech Hub Roma! I can help you find events, articles, or manage your account.
                </p>
            </div>
            <ChatInterface />
        </div>
    );
}
