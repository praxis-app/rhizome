// TODO: Add remaining layout and functionality - below is a WIP

import { Avatar, AvatarProps } from '@mui/material';
import chroma from 'chroma-js';
import ColorHash from 'color-hash';
import { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import LazyLoadImage from '../images/lazy-load-image';
import { Link } from '../shared/link';

interface Props extends AvatarProps {
  imageFile?: File;
  userName: string;
  linkStyles?: CSSProperties;
  size?: number;
  withLink?: boolean;
  href?: string;
}

const UserAvatar = ({
  imageFile,
  linkStyles,
  size,
  userName,
  sx,
  withLink,
  href,
  ...avatarProps
}: Props) => {
  const { t } = useTranslation();

  const avatarStyles = {
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

  const getNameAcronym = (name: string) => {
    const [firstName, lastName] = name.split('-');
    if (lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return `${firstName[0]}`.toUpperCase();
  };

  const getStringAvatarProps = (name: string): AvatarProps => {
    const colorHash = new ColorHash();
    const baseColor = colorHash.hex(name);
    const color = chroma(baseColor).darken(2).hex();
    const bgcolor = chroma(baseColor).brighten(1.5).hex();

    return {
      sx: { color, bgcolor, ...avatarStyles },
      children: getNameAcronym(name),
    };
  };

  const renderAvatar = () => {
    if (!imageFile) {
      return <Avatar {...getStringAvatarProps(userName)} />;
    }
    return (
      <Avatar sx={avatarStyles} {...avatarProps}>
        <LazyLoadImage
          alt={t('images.labels.profilePicture')}
          src={getImageFileSrc()}
          borderRadius="50%"
          minWidth="100%"
          minHeight="100%"
        />
      </Avatar>
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
