import { Close } from '@mui/icons-material';
import { Alert, IconButton, Snackbar, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppStore } from '../../store/app.store';

const AUTO_HIDE_DURATION = 6000;

const Toast = () => {
  const { toast, setToast } = useAppStore((state) => state);
  const [open, setOpen] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    if (toast) {
      setOpen(true);
    }
  }, [toast]);

  useEffect(
    () => () => {
      setToast(null);
      setOpen(false);
    },
    [setToast],
  );

  const handleClose = () => {
    setOpen(false);
  };

  if (!toast) {
    return null;
  }

  return (
    <Snackbar
      sx={{
        bottom: 80,
        transition: 'bottom 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      }}
      anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      autoHideDuration={AUTO_HIDE_DURATION}
      onClose={handleClose}
      open={open}
    >
      <Alert
        action={
          <IconButton size="small" onClick={handleClose}>
            <Close
              fontSize="small"
              sx={{ color: theme.palette.primary.main }}
            />
          </IconButton>
        }
        severity={toast.status}
        sx={{ color: theme.palette.text.primary }}
        variant="filled"
      >
        {toast.title}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
