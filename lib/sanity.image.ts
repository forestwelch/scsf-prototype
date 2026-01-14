import { urlFor as sanityUrlFor } from '@/sanity/lib/image';
import { SanityImageSource } from '@sanity/image-url/lib/types/types';

/**
 * Helper function to build optimized image URLs from Sanity image sources
 * @param source - Sanity image source (from image field)
 * @returns Image URL builder instance
 */
export const urlFor = (source: SanityImageSource) => {
  return sanityUrlFor(source);
};
