import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const themeBuilder = (dark) =>
    createMuiTheme({
        palette: dark
            ? {
                  type: 'dark',
                  primary: {
                      main: '#ffffff',
                      contrastText: '#004dff',
                  },
              }
            : {
                  background: {
                      default: '#f0f2f5',
                      paper: colors.common.white,
                  },
                  primary: {
                      contrastText: '#ffffff',
                      main: '#004dff',
                  },
                  text: {
                      primary: '#172b4d',
                      secondary: '#6b778c',
                  },
              },
        shadows,
        typography,
    });

export default themeBuilder;
