import purple from '@material-ui/core/colors/purple';
import { red } from '@material-ui/core/colors';

const lightColors = {
  primary: { ...purple, main: '#9F4A8F' },
  secondary: { ...red, main: '#E63C2F' }
};

const lightTheme = {
  palette: {
    type: 'light',
    ...lightColors
  }
};

const darkColors = {
  primary: { main: '#fff' },
  secondary: { ...red, main: '#E63C2F' }
};

const darkTheme = {
  palette: {
    type: 'dark',
    ...darkColors
  }
};

export { lightTheme, darkTheme, darkColors, lightColors };
