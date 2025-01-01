import { Close } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  IconButton,
  SxProps,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { KeyboardEvent, ReactNode } from 'react';
import { KeyCodes } from '../../constants/shared.constants';
import { useAboveBreakpoint } from '../../hooks/shared.hooks';

interface Props extends DialogProps {
  actionLabel?: string;
  appBarContent?: ReactNode;
  appBarSx?: SxProps;
  centeredTitle?: boolean;
  closingAction?(): void;
  contentSx?: SxProps;
  footerContent?: ReactNode;
  isClosingActionDisabled?: boolean;
  hideAppBar?: boolean;
  isLoading?: boolean;
  onClose?(): void;
  subtext?: string;
  topGap?: string | number;
}

const Modal = ({
  actionLabel,
  appBarContent,
  appBarSx,
  centeredTitle,
  children,
  closingAction,
  contentSx,
  footerContent,
  isClosingActionDisabled,
  isLoading,
  maxWidth,
  onClose,
  open,
  hideAppBar,
  subtext,
  title,
  topGap,
  sx,
  ...dialogProps
}: Props) => {
  const isDesktop = useAboveBreakpoint('md');
  const theme = useTheme();

  const titleBoxStyles: SxProps = {
    flex: 1,
    marginLeft: 1.25,
    marginTop: subtext ? 0.6 : 0,
  };
  const appBarStyles: SxProps = {
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
    position: 'relative',
    ...appBarSx,
  };
  const contentStyles: SxProps = isDesktop
    ? {
        width: '600px',
        ...contentSx,
      }
    : contentSx || {};

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.code !== KeyCodes.Escape) {
      return;
    }
    onClose?.();
  };

  const renderAppBarContent = () => {
    if (appBarContent) {
      return appBarContent;
    }
    if (centeredTitle) {
      return (
        <Toolbar>
          <Box sx={titleBoxStyles}>
            <Typography variant="h6" align="center" lineHeight={1.6}>
              {title}
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            color="primary"
            edge="start"
            onClick={onClose}
          >
            <Close />
          </IconButton>
        </Toolbar>
      );
    }
    return (
      <Toolbar>
        <IconButton
          aria-label="close"
          color="primary"
          edge="start"
          onClick={onClose}
        >
          <Close />
        </IconButton>
        <Box sx={titleBoxStyles}>
          <Typography variant="h6" lineHeight={subtext ? 0.9 : 1.6}>
            {title}
          </Typography>

          {subtext && (
            <Typography sx={{ fontSize: 14, marginLeft: 0.2 }}>
              {subtext}
            </Typography>
          )}
        </Box>
        {closingAction && actionLabel && (
          <Button
            disabled={isClosingActionDisabled || isLoading}
            onClick={closingAction}
            startIcon={
              isLoading && (
                <CircularProgress
                  size={10}
                  sx={{ marginRight: '4px', color: 'inherit' }}
                />
              )
            }
          >
            {actionLabel}
          </Button>
        )}
      </Toolbar>
    );
  };

  return (
    <Dialog
      sx={{ marginTop: topGap, ...sx }}
      onKeyDown={handleKeyDown}
      fullScreen={!isDesktop}
      maxWidth={maxWidth}
      open={open}
      // Required for mobile
      slotProps={{ backdrop: { onClick: onClose } }}
      // Required for desktop
      onClose={onClose}
      {...dialogProps}
    >
      {!hideAppBar && (
        <AppBar sx={appBarStyles}>{renderAppBarContent()}</AppBar>
      )}
      <DialogContent sx={contentStyles}>{children}</DialogContent>
      {footerContent}
    </Dialog>
  );
};

export default Modal;
