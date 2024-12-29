import { linearProgressClasses } from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme, Theme } from '@mui/material/styles';

// TODO: Convert to numeric member names
export enum Gray {
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

// TODO: Convert to numeric member names
export enum Blurple {
  BlueWhale = '#222d3e',
  Marina = '#5868CB',
  PoolWater = '#3b86f7',
  SavoryBlue = '#6573CF',
  SkyDancer = '#588cf2',
  Neptune = '#7D95E3',
}

declare module '@mui/material/styles/createPalette' {
  interface TypeText {
    tertiary: string;
  }
  interface TypeBackground {
    secondary: string;
  }
}

interface Props<OwnerState = unknown> {
  theme: Theme;
  ownerState: OwnerState;
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Inter',
  },
  colorSchemes: {
    light: {
      palette: {
        text: {
          tertiary: Blurple.Neptune,
        },
        background: {
          secondary: grey[100],
        },
        divider: Gray.Placebo,
      },
    },
    dark: {
      palette: {
        primary: {
          main: Gray.Placebo,
        },
        text: {
          primary: Gray.Placebo,
          secondary: Gray.Casper,
          tertiary: Blurple.Neptune,
        },
        background: {
          default: Gray.PianoBlack,
          paper: Gray.Nero,
          secondary: Gray.DeadPixel,
        },
        divider: Gray.DeadPixel,
      },
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        elevation: {
          boxShadow: `
            0 0 #0000,
            0 0 #0000,
            0 4px 6px -1px rgba(0,0,0,.1),
            0 2px 4px -2px rgba(0,0,0,.1)
          `,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        contained: ({ theme }: Props) => ({
          textTransform: 'none',
          backgroundColor: 'rgb(0, 0, 0, 0.04)',
          '&:hover': {
            backgroundColor: 'rgb(0, 0, 0, 0.07)',
            boxShadow: 'none',
          },
          boxShadow: 'none',
          color: 'black',

          ...theme.applyStyles('dark', {
            backgroundColor: 'rgb(255, 255, 255, 0.04)',
            '&:hover': { backgroundColor: 'rgb(255, 255, 255, 0.07)' },
            color: 'white',
          }),
        }),
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          '& .MuiTouchRipple-root .MuiTouchRipple-child': {
            borderRadius: 7,
          },
        },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: grey[100],
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: grey[800],
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: grey[100],
              borderWidth: 1,
            },
          },
        },
        notchedOutline: {
          borderColor: grey[800],
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          color: theme.palette.common.black,
          ...theme.applyStyles('dark', {
            color: theme.palette.common.white,
          }),
        }),
      },
    },

    MuiMenu: {
      styleOverrides: {
        list: ({ theme }: Props) => ({
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          padding: 4,
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.divider,
          }),
        }),
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          borderRadius: 4,
          transition: 'background-color 0.15s cubic-bezier(.4,0,.2,1)',

          '&:hover': {
            backgroundColor: 'rgb(0, 0, 50, 0.04)',
            ...theme.applyStyles('dark', {
              backgroundColor: 'rgb(205, 205, 255, 0.1)',
            }),
          },
        }),
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          '--Paper-overlay': 'none !important',
        },
        colorPrimary: ({ theme }: Props) => ({
          backgroundColor: theme.palette.background.default,
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.default,
          }),
        }),
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.915)',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          ...theme.applyStyles('dark', {
            backgroundColor: theme.palette.background.default,
          }),
        }),
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: '#fafafa',
            ...theme.applyStyles('dark', {
              backgroundColor: '#09090b',
            }),
          },
          [`& .${linearProgressClasses.bar}`]: {
            backgroundColor: '#e4e4e7',
            ...theme.applyStyles('dark', {
              backgroundColor: '#18181b',
            }),
          },
        }),
      },
    },
  },
});
