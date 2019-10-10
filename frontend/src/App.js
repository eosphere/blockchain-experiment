import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import './transit/initTransit.js';
import AccessContextSubscribe from './transit/AccessContextSubscribe';
import store from './store';
import { MainLayout } from './components';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { darkColors, lightColors, darkTheme, lightTheme } from './theme';
import AppRoutes from './AppRoutes';

const App = () => {
  const recentTheme = localStorage.getItem('theme');
  const useTheme = recentTheme === 'light' ? lightTheme : darkTheme;
  const [theme, setTheme] = useState(useTheme);

  const toggleDarkTheme = () => {
    const newThemeType = theme.palette.type === 'light' ? 'dark' : 'light';
    const isDark = newThemeType === 'dark';
    localStorage.setItem('theme', newThemeType);
    setTheme({
      palette: {
        type: newThemeType,
        ...(isDark ? darkColors : lightColors)
      }
    });
  };

  const muiTheme = createMuiTheme(theme);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Provider store={store}>
        <AccessContextSubscribe>
          {() => (
            <Router>
              <MainLayout toggleTheme={toggleDarkTheme}>
                <AppRoutes />
              </MainLayout>
            </Router>
          )}
        </AccessContextSubscribe>
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
