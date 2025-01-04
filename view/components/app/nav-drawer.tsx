import { Close } from '@mui/icons-material';
import { Box, Divider, Drawer, IconButton, SxProps } from '@mui/material';
import { useAppStore } from '../../store/app.store';

const NavDrawer = () => {
  const { isNavDrawerOpen, setIsNavDrawerOpen } = useAppStore((state) => state);

  const drawerSx: SxProps = {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(25px)',
    },
  };

  return (
    <Drawer
      anchor="left"
      open={isNavDrawerOpen}
      onClose={() => setIsNavDrawerOpen(false)}
      PaperProps={{ sx: { width: '100%' } }}
      sx={drawerSx}
    >
      <Box display="flex" sx={{ marginY: 0.5, marginRight: 0.5 }}>
        <IconButton onClick={() => setIsNavDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <Divider />
    </Drawer>
  );
};

export default NavDrawer;
