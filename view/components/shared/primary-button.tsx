import {
  Button,
  ButtonProps,
  CircularProgress,
  SxProps,
  useTheme,
} from '@mui/material';
import { Blurple, GRAY } from '../../styles/theme';

interface Props extends ButtonProps {
  isLoading?: boolean;
  sx?: SxProps;
}

const PrimaryActionButton = ({ isLoading, children, sx, ...props }: Props) => {
  const theme = useTheme();

  const buttonStyles: SxProps = {
    backgroundColor: Blurple.Marina,
    '&:active': {
      backgroundColor: Blurple.Marina,
    },
    '&:hover': {
      backgroundColor: Blurple.SavoryBlue,
    },
    '&:disabled': {
      backgroundColor: GRAY['600'],
    },
    color: theme.palette.common.white,
    fontWeight: 600,
    letterSpacing: '0.2px',
    textTransform: 'none',
    borderRadius: 9999,
    padding: '0 15px',
    minWidth: 85,
    height: 38,
    ...sx,
  };

  return (
    <Button sx={buttonStyles} {...props}>
      {isLoading && (
        <CircularProgress
          size={10}
          color="inherit"
          sx={{ marginRight: 0.75 }}
        />
      )}
      {children}
    </Button>
  );
};

export default PrimaryActionButton;
