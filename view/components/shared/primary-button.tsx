import {
  Button,
  ButtonProps,
  CircularProgress,
  SxProps,
  useTheme,
} from '@mui/material';

// TODO: Move to theme.ts
enum Blurple {
  BlueWhale = '#222d3e',
  Marina = '#5868CB',
  PoolWater = '#3b86f7',
  SavoryBlue = '#6573CF',
  SkyDancer = '#588cf2',
  Neptune = '#7D95E3',
}

// TODO: Move to theme.ts or replace with MUI grey
export enum DarkMode {
  Placebo = '#e4e6ea',
  NimbusCloud = '#d3d5d9',
  Casper = '#b1b3b8',
  Griffin = '#8c8c8d',
  Excalibur = '#666768',
  Liver = '#505051',
  DeadPixel = '#3a3b3c',
  PhantomShip = '#303233',
  Nero = '#242526',
  PianoBlack = '#18191a',
}

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
      backgroundColor: DarkMode.Liver,
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
