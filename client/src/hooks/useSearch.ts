import { useState, useEffect } from 'react';

interface Source {
  title: string;
  url: string;
  snippet: string;
}

interface SearchResult {
  summary: string;
  sources: Source[];
  sessionId?: string;
}

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!query) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return { results, isLoading, error };
} 