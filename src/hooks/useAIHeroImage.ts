import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// In-memory cache for AI-generated images (session only)
const imageCache = new Map<string, string>();

type ItemType = 'challenge' | 'game' | 'reward';

export function useAIHeroImage(itemId: string | null, type: ItemType | null, title: string | null, enabled: boolean) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generationInProgress = useRef(false);

  const generateImage = useCallback(async () => {
    if (!itemId || !type || !title || generationInProgress.current) return;
    
    const cacheKey = `${type}-${itemId}`;
    
    // Check cache first
    const cached = imageCache.get(cacheKey);
    if (cached) {
      setImageUrl(cached);
      setIsLoading(false);
      return;
    }

    generationInProgress.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-hero-image', {
        body: { type, title }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        if (data.error.includes('Rate limit')) {
          toast.error('Rate limit exceeded. Please try again later.');
        } else if (data.error.includes('Payment')) {
          toast.error('AI credits exhausted. Please add more credits.');
        }
        throw new Error(data.error);
      }

      if (data?.imageUrl) {
        imageCache.set(cacheKey, data.imageUrl);
        setImageUrl(data.imageUrl);
      }
    } catch (err) {
      console.error('Failed to generate hero image:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setIsLoading(false);
      generationInProgress.current = false;
    }
  }, [itemId, type, title]);

  useEffect(() => {
    if (enabled && itemId && type && title) {
      // Check cache immediately
      const cacheKey = `${type}-${itemId}`;
      const cached = imageCache.get(cacheKey);
      if (cached) {
        setImageUrl(cached);
        setIsLoading(false);
      } else {
        setImageUrl(null);
        generateImage();
      }
    } else {
      setImageUrl(null);
      setIsLoading(false);
    }
  }, [enabled, itemId, type, title, generateImage]);

  return { imageUrl, isLoading, error };
}
