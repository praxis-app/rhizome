import { BoxProps, SxProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { Image } from '../../types/image.types';
import LazyLoadImage from './lazy-load-image';

interface Props extends BoxProps {
  image: Image;
  marginBottom?: string | number;
  width?: string | number;
  onImageLoad?(): void;
  isPlaceholder?: boolean;
  sx?: SxProps;
}

const AttachedImage = ({
  image,
  marginBottom,
  width = '100%',
  onImageLoad,
  isPlaceholder,
  ...boxProps
}: Props) => {
  const images = useAppStore((state) => state.imageCache);
  const [isLoaded, setIsLoaded] = useState(!!images[image.id]);

  const { t } = useTranslation();
  const isLarge = useAboveBreakpoint('md');

  const loadingHeight = isLarge ? '400px' : '300px';
  const height = isLoaded ? 'auto' : loadingHeight;

  const handleLoad = () => {
    onImageLoad?.();
    setIsLoaded(true);
  };

  return (
    <LazyLoadImage
      imageId={image.id}
      alt={t('images.labels.attachedImage')}
      width={width}
      height={height}
      onLoad={handleLoad}
      marginBottom={marginBottom}
      isPlaceholder={isPlaceholder}
      {...boxProps}
    />
  );
};

export default AttachedImage;
