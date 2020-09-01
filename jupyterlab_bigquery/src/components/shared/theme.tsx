import { createMuiTheme } from '@material-ui/core';

const COLORS = {
  blue: '#1A73E8',
  red: '#EA4335',
  green: '#34A853',
  yellow: '#FBBC04',
};

const DARKCOLORS = {
  blue: '#8AB4F8',
  red: '#F28B82',
  green: '#81C995',
  yellow: '#FDD663',
};

export const lightTheme = createMuiTheme({
  palette: {
    primary: {
      main:
        document.body.getAttribute('data-jp-theme-light') === 'true'
          ? COLORS.blue
          : DARKCOLORS.blue,
    },
  },
  // overrides: {
  //   MuiButton: {
  //     contained: {
  //       backgroundColor:
  //         document.body.getAttribute('data-jp-theme-light') === 'true'
  //           ? COLORS.blue
  //           : DARKCOLORS.blue,
  //     },
  //   },
  //   MuiCircularProgress: {
  //     colorPrimary: {
  //       color: DARKCOLORS.blue,
  //     },
  //   },
  // },
});

export const darkTheme = createMuiTheme({
  palette: {
    primary: {
      main: DARKCOLORS.blue,
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        backgroundColor: DARKCOLORS.blue,
      },
    },
    MuiCircularProgress: {
      colorPrimary: {
        color: DARKCOLORS.blue,
      },
    },
  },
});
