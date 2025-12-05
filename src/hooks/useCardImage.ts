import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// In-memory cache for generated images (session only)
const imageCache = new Map<string, string>();
// Track in-flight generation requests to prevent duplicates
const pendingRequests = new Map<string, Promise<string | null>>();

type ItemType = 'challenge' | 'game' | 'reward';

interface UseCardImageOptions {
  itemId: string | null;
  type: ItemType | null;
  title: string | null;
  existingImageUrl?: string | null;
  enabled?: boolean;
}

export function useCardImage({ 
  itemId, 
  type, 
  title, 
  existingImageUrl,
  enabled = true 
}: UseCardImageOptions) {
  const [imageUrl, setImageUrl] = useState<string | null>(existingImageUrl || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const generateImage = useCallback(async () => {
    if (!itemId || !type || !title) return null;
    
    const cacheKey = `${type}-${itemId}`;
    
    // Check cache first
    const cached = imageCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Check if there's already a pending request for this item
    const pending = pendingRequests.get(cacheKey);
    if (pending) {
      return pending;
    }

    // Create and track the request
    const request = (async () => {
      try {
        console.log(`Generating card image for ${type}: "${title}"`);
        
        const { data, error: fnError } = await supabase.functions.invoke('generate-card-image', {
          body: { type, title, itemId }
        });

        if (fnError) {
          throw new Error(fnError.message);
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.imageUrl) {
          imageCache.set(cacheKey, data.imageUrl);
          return data.imageUrl;
        }

        return null;
      } catch (err) {
        console.error('Failed to generate card image:', err);
        throw err;
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, request);
    return request;
  }, [itemId, type, title]);

  useEffect(() => {
    if (!enabled || !itemId || !type || !title) {
      return;
    }

    // If we have an existing image URL, use it
    if (existingImageUrl) {
      setImageUrl(existingImageUrl);
      setIsLoading(false);
      return;
    }

    // Check cache
    const cacheKey = `${type}-${itemId}`;
    const cached = imageCache.get(cacheKey);
    if (cached) {
      setImageUrl(cached);
      setIsLoading(false);
      return;
    }

    // Generate new image
    setIsLoading(true);
    setError(null);

    generateImage()
      .then((url) => {
        if (mountedRef.current && url) {
          setImageUrl(url);
        }
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to generate image');
        }
      })
      .finally(() => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      });
  }, [enabled, itemId, type, title, existingImageUrl, generateImage]);

  return { imageUrl, isLoading, error };
}
