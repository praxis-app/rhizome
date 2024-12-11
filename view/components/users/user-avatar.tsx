// TODO: Add remaining layout and functionality - below is a WIP

import { Box, BoxProps } from '@mui/material';
import { grey } from '@mui/material/colors';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadImage from '../images/lazy-load-image';
import { Link } from '../shared/link';

interface Props extends BoxProps {
  imageFile?: File;
  linkStyles?: CSSProperties;
  size?: number;
  user?: any;
  withLink?: boolean;
  href?: string;
}

const UserAvatar = ({
  imageFile,
  linkStyles,
  size,
  sx,
  user,
  withLink,
  href,
  ...avatarProps
}: Props) => {
  const { t } = useTranslation();

  const avatarStyles = {
    backgroundColor: grey[900],
    borderRadius: '50%',
    width: 40,
    height: 40,
    ...sx,
    ...(size ? { width: size, height: size } : {}),
  };

  const getImageFileSrc = () => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
  };

  const renderAvatar = () => {
    return (
      <Box display="flex" sx={avatarStyles} {...avatarProps}>
        <LazyLoadImage
          alt={t('images.labels.profilePicture')}
          src={getImageFileSrc()}
          borderRadius="50%"
          minWidth="100%"
          minHeight="100%"
        />
      </Box>
    );
  };

  if (withLink && href) {
    return (
      <Link to={href} sx={linkStyles}>
        {renderAvatar()}
      </Link>
    );
  }

  return renderAvatar();
};

export default UserAvatar;
