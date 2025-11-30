import { useState, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GuideAccessContent {
  title: string;
  description: string;
  passwordPlaceholder: string;
  submitButton: string;
  errorMessage: string;
}

interface GuidePasswordGateProps {
  children: ReactNode;
  correctPassword: string;
  content: GuideAccessContent;
}

export function GuidePasswordGate({ children, correctPassword, content }: GuidePasswordGateProps) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsUnlocked(true);
      setError('');
    } else {
      setError(content.errorMessage);
      setPassword('');
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{content.title}</CardTitle>
          <CardDescription>
            {content.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder={content.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {content.submitButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
