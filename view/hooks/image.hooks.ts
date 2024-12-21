import { RefObject } from 'react';
import { useQuery } from 'react-query';
import { api } from '../client/api-client';
import { useAppStore } from '../store/app.store';
import { useInView } from './shared.hooks';

// TODO: Remove image cache from store and just use react-query instead
export const useImageSrc = (
  imageId: string | undefined,
  ref: RefObject<HTMLElement>,
  enabled = true,
) => {
  const { imageCache, setImageCache } = useAppStore((state) => state);
  const { viewed } = useInView(ref, '100px');

  const { data } = useQuery(
    ['image', imageId],
    async () => {
      if (!imageId) {
        return;
      }
      const result = await api.getImage(imageId);
      const url = URL.createObjectURL(result);
      setImageCache({ ...imageCache, [imageId]: url });
      return url;
    },
    {
      enabled: enabled && !!imageId && !imageCache[imageId] && viewed,
    },
  );

  return data;
};
