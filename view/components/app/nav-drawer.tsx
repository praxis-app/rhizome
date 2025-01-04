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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingLeft={1}
        height="55px"
      >
        <IconButton
          onClick={() => setIsNavDrawerOpen(false)}
          sx={{ width: 38, height: 38 }}
        >
          <Close />
        </IconButton>
      </Box>
      <Divider />
    </Drawer>
  );
};

export default NavDrawer;
