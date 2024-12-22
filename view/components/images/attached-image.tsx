import { BoxProps, SxProps } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
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
  ...boxProps
}: Props) => {
  const images = useAppStore((state) => state.imageCache);
  const [isLoaded, setIsLoaded] = useState(!!images[image.id]);
  const [isEnlarged, setIsEnlarged] = useState(false);

  const { t } = useTranslation();
  const isLarge = useAboveBreakpoint('md');

  const loadingHeight = isLarge ? '400px' : '300px';
  const height = isLoaded ? 'auto' : loadingHeight;

  const modalSx: SxProps = {
    '& .MuiDialog-paper': {
      marginBottom: isLarge ? 12 : 0,
    },
  };
  const modalContentSx: SxProps = {
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: isLarge ? 'fit-content' : '60vh',
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
            imageId={image.id}
            alt={t('images.labels.attachedImage')}
            marginBottom={isLarge ? 0 : 35}
            width="100%"
            height="auto"
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
        {...boxProps}
      />
    </>
  );
};

export default AttachedImage;
