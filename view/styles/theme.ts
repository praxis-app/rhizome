import { linearProgressClasses } from '@mui/material';
import { createTheme, Theme } from '@mui/material/styles';

export const GRAY = {
  '50': '#f5f5f5',
  '100': '#e4e6ea',
  '200': '#d3d5d9',
  '300': '#b1b3b8',
  '400': '#8c8c8d',
  '500': '#505051',
  '600': '#424242',
  '700': '#3a3b3c',
  '800': '#303233',
  '900': '#242526',
  '950': '#18191a',
} as const;

export const BLURPLE = {
  '300': '#7D95E3',
  '400': '#6573CF',
  '500': '#5868CB',
} as const;

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
          tertiary: BLURPLE['300'],
        },
        background: {
          secondary: GRAY['50'],
        },
        divider: GRAY['100'],
      },
    },
    dark: {
      palette: {
        primary: {
          main: GRAY['100'],
        },
        text: {
          primary: GRAY['100'],
          secondary: GRAY['300'],
          tertiary: BLURPLE['300'],
        },
        background: {
          default: GRAY['950'],
          paper: GRAY['900'],
          secondary: GRAY['700'],
        },
        divider: GRAY['700'],
      },
    },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          // Mobile (first priority)
          paddingTop: 80,

          // Tablet
          [theme.breakpoints.up('sm')]: {
            paddingTop: 102.5,
          },

          // Desktop
          [theme.breakpoints.up('md')]: {
            paddingTop: 120,
          },

          // Larger devices
          [theme.breakpoints.up('lg')]: {
            paddingTop: 150,
          },
        }),
        maxWidthSm: ({ theme }: Props) => ({
          [theme.breakpoints.up('md')]: {
            maxWidth: 680,
          },
        }),
      },
    },

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
        root: ({ theme }: Props) => ({
          backgroundImage: 'none',
          borderRadius: '12px',

          ...theme.applyStyles('light', {
            boxShadow:
              '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px -1px rgba(0, 0, 0, .1);',
            border: `1px solid ${GRAY[100]}`,
          }),
        }),
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
        root: ({ theme }: Props) => ({
          '&.Mui-focused': {
            color: theme.palette.text.secondary,
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: GRAY[200],
              ...theme.applyStyles('dark', {
                borderColor: GRAY[600],
              }),
            },
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: GRAY[400],
              ...theme.applyStyles('dark', {
                borderColor: GRAY[100],
              }),
              borderWidth: 1,
            },
          },
        }),
        notchedOutline: ({ theme }: Props) => ({
          borderColor: GRAY[200],
          ...theme.applyStyles('dark', {
            borderColor: GRAY[600],
          }),
        }),
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          color: theme.palette.common.black,
          ...theme.applyStyles('dark', {
            color: theme.palette.text.primary,
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

    MuiTab: {
      styleOverrides: {
        root: ({ theme }: Props) => ({
          fontSize: 16,
          textTransform: 'none',

          [theme.breakpoints.up('sm')]: {
            minWidth: 160,
          },
        }),
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }: Props) => ({
          backgroundColor: theme.palette.background.paper,
          '--Paper-overlay': 'none !important',
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
            ...theme.applyStyles('light', {
              backgroundColor: '#fafafa',
            }),
          },
          [`& .${linearProgressClasses.bar}`]: {
            ...theme.applyStyles('light', {
              backgroundColor: '#e4e4e7',
            }),
          },
        }),
      },
    },
  },
});
