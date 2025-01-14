import { ArrowBack, Search } from '@mui/icons-material';
import { Box, IconButton, SxProps, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useIsDarkMode } from '../../hooks/shared.hooks';
import { useAppStore } from '../../store/app.store';
import { GRAY } from '../../styles/theme';

interface Props {
  header?: string;
}

const TopNav = ({ header }: Props) => {
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
          onClick={() => setIsNavDrawerOpen(true)}
          sx={{ ...buttonSx, marginRight: 0.5 }}
          edge="start"
        >
          <ArrowBack />
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
