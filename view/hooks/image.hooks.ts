import { RefObject, useEffect, useState } from 'react';
import { useInView } from './shared.hooks';
import { API_ROOT } from '../client/client.constants';
import { useAppStore } from '../store/app.store';

export const useImageSrc = (
  imageId: number | undefined,
  ref: RefObject<HTMLElement>,
) => {
  const { imageCache, setImageCache } = useAppStore((state) => state);
  const [src, setSrc] = useState<string>();

  const { viewed } = useInView(ref, '100px');

  useEffect(() => {
    if (!imageId || !viewed) {
      return;
    }
    if (imageCache[imageId]) {
      setSrc(imageCache[imageId]);
      return;
    }
    const getImageSrc = async () => {
      const imagePath = `${API_ROOT}/images/${imageId}/view`;
      const token = localStorage.getItem('token');
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const result = await fetch(imagePath, headers);
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);

      setImageCache({ ...imageCache, [imageId]: url });
      setSrc(url);
    };
    getImageSrc();
  }, [imageId, viewed, imageCache]);

  return src;
};
