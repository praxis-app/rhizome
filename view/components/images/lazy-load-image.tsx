import { Box, BoxProps, SxProps } from '@mui/material';
import { SyntheticEvent, useRef, useState } from 'react';
import { useAppStore } from '../../store/app.store';
import { useImageSrc } from '../../hooks/image.hooks';

interface Props extends BoxProps {
  alt: string;
  skipAnimation?: boolean;
  isPlaceholder?: boolean;
  imageId?: string;
  src?: string;
  sx?: SxProps;
}

const LazyLoadImage = ({
  alt,
  skipAnimation = false,
  isPlaceholder,
  imageId,
  onLoad,
  src,
  sx,
  ...boxProps
}: Props) => {
  const images = useAppStore((state) => state.imageCache);
  const alreadyLoadedSrc = imageId && images[imageId];
  const [loaded, setLoaded] = useState(!!alreadyLoadedSrc);

  const ref = useRef<HTMLDivElement>(null);
  const srcFromImageId = useImageSrc(imageId, ref, !isPlaceholder);

  const animationStyles: SxProps = {
    transition: 'filter 0.3s, opacity 0.3s',
    filter: loaded ? 'blur(0)' : 'blur(15px)',
    opacity: loaded ? 1 : 0,
  };

  const imageStyles: SxProps = {
    objectFit: 'cover',
    ...(!skipAnimation && animationStyles),
    ...sx,
  };

  const handleLoad = (event: SyntheticEvent<HTMLImageElement, Event>) => {
    onLoad && onLoad(event);
    setLoaded(true);
  };

  return (
    <Box
      ref={ref}
      alt={alt}
      component="img"
      loading={src ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      src={src || alreadyLoadedSrc || srcFromImageId}
      sx={imageStyles}
      {...boxProps}
    />
  );
};

export default LazyLoadImage;
