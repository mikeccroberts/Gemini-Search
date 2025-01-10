import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { UserMenu } from '@/components/UserMenu';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomKeysManager } from "@/components/CustomKeysManager";
import { useToast } from "@/components/ui/use-toast";

export function Home() {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCustomKeysChange = async (keys: string[]) => {
    try {
      if (keys.length === 0) {
        // Clear custom keys
        await fetch("/api/keys/custom", {
          method: "DELETE",
        });
        toast({
          title: "Custom keys cleared",
          description: "Using default API keys",
        });
      } else {
        // Set custom keys
        const response = await fetch("/api/keys/custom", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ keys }),
        });

        if (!response.ok) {
          throw new Error("Failed to set custom keys");
        }

        toast({
          title: "Custom keys updated",
          description: `Now using ${keys.length} custom API key${keys.length > 1 ? 's' : ''}`,
        });
      }
    } catch (error) {
      console.error("Error updating custom keys:", error);
      toast({
        title: "Error",
        description: "Failed to update custom keys",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute top-4 left-4">
        <CustomKeysManager onKeysChange={handleCustomKeysChange} />
      </div>
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <UserMenu />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-3xl px-4 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <Logo className="mb-6" />
          <h1 className="text-2xl lg:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-200">
            What do you want to know?
          </h1>
        </div>

        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              className="w-full px-6 py-4 text-lg rounded-full border border-gray-200 
                       focus:border-google-blue focus:ring-4 focus:ring-google-blue/20 outline-none 
                       transition-all duration-300 shadow-sm 
                       group-hover:shadow-lg group-hover:border-gray-300
                       dark:bg-gray-800 dark:border-gray-700 dark:text-white
                       dark:focus:border-google-blue dark:group-hover:border-gray-600
                       pr-14 truncate"
              style={{ fontFamily: 'Inter, sans-serif' }}
              autoFocus
            />
            <button
              type="submit"
              disabled={!query.trim()}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 
                         hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100
                         disabled:hover:bg-transparent z-10 bg-background dark:bg-gray-800"
            >
              <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 animate-fade-in space-y-1">
          <div>Powered by Gemini 2.0</div>
          <div>
            Created by <a href="http://x.com/ammaar" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors">@ammaar</a>
          </div>
        </div>
      </div>
    </div>
  );
}
