import purple from '@material-ui/core/colors/purple';

const lightColors = {
  primary: { ...purple, main: '#9F4A8F' }
};

const lightTheme = {
  palette: {
    type: 'light',
    ...lightColors
  }
};

const darkColors = {
  primary: { main: '#fff' }
};

const darkTheme = {
  palette: {
    type: 'dark',
    ...darkColors
  }
};

export { lightTheme, darkTheme, darkColors, lightColors };
