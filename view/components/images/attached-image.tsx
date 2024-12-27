import { BoxProps, SxProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { Image } from '../../types/image.types';
import Modal from '../shared/modal';
import LazyLoadImage from './lazy-load-image';

interface Props extends BoxProps {
  image: Image;
  marginBottom?: string | number;
  width?: string | number;
  onImageLoad?(): void;
  sx?: SxProps;
}

const AttachedImage = ({
  image,
  marginBottom,
  width = '100%',
  onImageLoad,
  sx,
  ...boxProps
}: Props) => {
  const queryClient = useQueryClient();
  const previouslyLoaded = queryClient.getQueryData(['image', image.id]);
  const [isLoaded, setIsLoaded] = useState(previouslyLoaded);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const { t } = useTranslation();
  const isLarge = useAboveBreakpoint('md');

  const loadingHeight = isLarge ? '400px' : '300px';
  const height = isLoaded ? 'auto' : loadingHeight;

  const imageSx: SxProps = {
    cursor: isLoaded ? 'pointer' : 'default',
    ...sx,
  };
  const enlargedImageSx: SxProps = {
    objectFit: 'contain',
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: 1,
    marginBottom: isLarge ? 0 : 35,
  };
  const modalSx: SxProps = {
    '& .MuiDialog-paper': {
      marginBottom: isLarge ? '35px' : 0,
    },
  };
  const modalContentSx: SxProps = {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  };

  const handleLoad = () => {
    onImageLoad?.();
    setIsLoaded(true);
  };

  const handleClick = () => {
    if (isLoaded) {
      setIsEnlarged(true);
    }
  };

  return (
    <>
      <Modal
        open={isEnlarged}
        onClose={() => setIsEnlarged(false)}
        appBarSx={{ borderBottom: 'none' }}
        contentSx={modalContentSx}
        hideAppBar={isLarge}
        sx={modalSx}
      >
        {isEnlarged && (
          <LazyLoadImage
            alt={t('images.labels.attachedImage')}
            sx={enlargedImageSx}
            imageId={image.id}
          />
        )}
      </Modal>

      <LazyLoadImage
        imageId={image.id}
        alt={t('images.labels.attachedImage')}
        width={width}
        height={height}
        onLoad={handleLoad}
        marginBottom={marginBottom}
        isPlaceholder={image.isPlaceholder}
        onClick={handleClick}
        sx={imageSx}
        {...boxProps}
      />
    </>
  );
};

export default AttachedImage;
