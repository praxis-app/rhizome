import { ArrowBack, Search } from '@mui/icons-material';
import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';

interface Props {
  header?: string;
  onBackClick?: () => void;
  backBtnIcon?: ReactNode;
}

const TopNav = ({ header, onBackClick, backBtnIcon }: Props) => {
  const { setIsNavDrawerOpen } = useAppStore((state) => state);

  const { t } = useTranslation();
  const isDarkMode = useIsDarkMode();
  const navigate = useNavigate();

  const headerSx: SxProps = {
    color: 'white',
    cursor: header ? 'default' : 'pointer',
    fontSize: header ? '17px' : '18px',
    fontWeight: header ? 600 : 700,
    paddingLeft: 0.5,
  };
  const buttonSx: SxProps = {
    width: 38,
    height: 38,
  };

  const handleHeaderClick = () => {
    if (!header) {
      navigate('/');
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
      return;
    }
    // Show nav drawer as default behavior
    setIsNavDrawerOpen(true);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderBottom={`1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.04)' : GRAY[50]}`}
      bgcolor="background.paper"
      paddingRight={2.4}
      paddingLeft={2.5}
      height="55px"
      position="fixed"
      width="100%"
      top={0}
      left={0}
    >
      <Box display="flex" alignItems="center">
        <IconButton
          onClick={handleBackClick}
          sx={{ ...buttonSx, marginRight: 0.5 }}
          edge="start"
        >
          {backBtnIcon || <ArrowBack />}
        </IconButton>

        <Typography variant="h1" sx={headerSx} onClick={handleHeaderClick}>
          {header || t('brand')}
        </Typography>
      </Box>

      <IconButton
        sx={buttonSx}
        aria-label={t('labels.menu')}
        size="large"
        edge="end"
      >
        <Search />
      </IconButton>
    </Box>
  );
};

export default TopNav;
