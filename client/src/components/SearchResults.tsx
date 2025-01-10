import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { SourceList } from '@/components/SourceList';
import { Logo } from '@/components/Logo';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SearchResultsProps {
  query: string;
  results: any;
  isLoading: boolean;
  error?: Error;
  isFollowUp?: boolean;
  originalQuery?: string;
}

export function SearchResults({
  query,
  results,
  isLoading,
  error,
  isFollowUp,
  originalQuery
}: SearchResultsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (results && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [results]);

  const copyContent = async () => {
    if (contentRef.current) {
      try {
        // Get the text content without HTML tags
        const textContent = contentRef.current.innerText;
        await navigator.clipboard.writeText(textContent);
        toast({
          title: "Copied to clipboard",
          description: "The search result has been copied to your clipboard.",
        });
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Please try again or copy manually.",
          variant: "destructive",
        });
      }
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="animate-in fade-in-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error.message || 'An error occurred while searching. Please try again.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in fade-in-50">
        <div className="flex justify-center mb-8">
          <Logo animate className="w-12 h-12" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-4 w-3/4 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </Card>
        <div className="space-y-2">
          <Skeleton className="h-[100px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </div>
      </div>
    );
  }

  if (!results) return null;

  return (
    <div ref={contentRef} className="space-y-6 animate-in fade-in-50">
      {/* Search Query Display */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        {isFollowUp && originalQuery && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-xs sm:text-sm text-muted-foreground/70">
              <span>Original search:</span>
              <span className="font-medium">"{originalQuery}"</span>
            </div>
            <div className="h-px bg-border w-full" />
          </>
        )}
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm sm:text-base text-muted-foreground">
          <span>{isFollowUp ? 'Follow-up question:' : ''}</span>
          <h1 className="font-serif text-lg sm:text-3xl text-foreground">"{query}"</h1>
        </div>
      </motion.div>

      {/* Sources Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SourceList sources={results.sources || []} />
      </motion.div>

      {/* Main Content */}
      <Card className="overflow-hidden shadow-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="py-4 px-8 relative"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={copyContent}
            title="Copy content"
            className="absolute top-4 right-4"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <div
            className={cn(
              "prose prose-slate max-w-none mt-8",
              "dark:prose-invert",
              "prose-headings:font-bold prose-headings:mb-4",
              "prose-h2:text-2xl prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2 prose-h2:border-border",
              "prose-h3:text-xl prose-h3:mt-6",
              "prose-p:text-base prose-p:leading-7 prose-p:my-4",
              "prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6",
              "prose-li:my-2 prose-li:marker:text-muted-foreground",
              "prose-strong:font-semibold",
              "prose-a:text-primary prose-a:no-underline hover:prose-a:text-primary/80",
            )}
            dangerouslySetInnerHTML={{
              __html: results.summary
            }}
          />
        </motion.div>
      </Card>
    </div>
  );
}