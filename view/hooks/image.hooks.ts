import { RefObject } from 'react';
import { useQuery } from 'react-query';
import { api } from '../client/api-client';
import { useInView } from './shared.hooks';

export const useImageSrc = (
  imageId: string | undefined,
  ref: RefObject<HTMLElement>,
  enabled = true,
) => {
  const { viewed } = useInView(ref, '100px');

  const { data } = useQuery(
    ['image', imageId],
    async () => {
      if (!imageId) {
        return;
      }
      const result = await api.getImage(imageId);
      const url = URL.createObjectURL(result);
      return url;
    },
    {
      enabled: enabled && !!imageId && viewed,
    },
  );

  return data;
};
