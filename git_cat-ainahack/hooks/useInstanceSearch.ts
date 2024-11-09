// src/hooks/useInstanceSearch.ts
import { useState, useEffect } from 'react';
import { LLISTA_INSTANCIES } from '@/prompts/instanceTypes';

interface UseInstanceSearchResult {
  matchedInstances: string[];
  isSearching: boolean;
  error: string | null;
}

export const useInstanceSearch = (text: string | null): UseInstanceSearchResult => {
  const [matchedInstances, setMatchedInstances] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setMatchedInstances([]);
      return;
    }

    setIsSearching(true);
    try {
      const matches = LLISTA_INSTANCIES.filter(instance => 
        text.toLowerCase().includes(instance.toLowerCase())
      );
      
      setMatchedInstances(matches);
      setError(null);
    } catch (err) {
      setError('Error searching for instances');
      setMatchedInstances([]);
    } finally {
      setIsSearching(false);
    }
  }, [text]);

  return { matchedInstances, isSearching, error };
};