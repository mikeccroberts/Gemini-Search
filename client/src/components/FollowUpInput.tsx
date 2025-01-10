import { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FollowUpInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export function FollowUpInput({ 
  onSubmit,
  isLoading = false,
}: FollowUpInputProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      <div className="flex-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up question..."
          className={cn(
            "transition-all duration-200",
            "focus-visible:ring-1 focus-visible:ring-primary",
            "placeholder:text-muted-foreground/70",
            "w-full"
          )}
          disabled={isLoading}
        />
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={!query.trim() || isLoading}
        className="flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <MessageSquarePlus className="h-4 w-4" />
            Ask
          </>
        )}
      </Button>
    </div>
  );
} 