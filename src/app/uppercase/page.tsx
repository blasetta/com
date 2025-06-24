'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { uppercaseText } from '@/ai/flows/uppercase-flow';
import { Label } from '@/components/ui/label';

export default function UppercasePage() {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultText('');

    try {
      const result = await uppercaseText({ text: inputText });
      setResultText(result);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline">Uppercase Converter</CardTitle>
          <CardDescription>
            Enter some text below and click the button to see it in uppercase. This is processed by a server-side function.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="text-input">Your Text</Label>
              <Input
                id="text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type something here..."
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Converting...' : 'Convert to Uppercase'}
            </Button>
          </CardFooter>
        </form>
        {(resultText || error) && (
           <CardContent className="pt-0">
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold font-headline mb-2">Result</h3>
              {resultText && <p className="text-lg font-mono break-all">{resultText}</p>}
              {error && <p className="text-destructive">{error}</p>}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
