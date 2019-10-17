import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store';
import { MuiThemeProvider, createMuiTheme, CssBaseline } from '@material-ui/core';
import { darkColors, lightColors, darkTheme, lightTheme } from './theme';
import AccessContextSubscribe from './transit/AccessContextSubscribe';
import './transit/initTransit.js';
import AppRoutes from './AppRoutes';
import { MainLayout } from './components';
import { isProduction } from 'utils';

const store = configureStore();

const App = () => {
  if (isProduction) {
    window.onbeforeunload = function() {
      return 'Data will be lost if you leave the page, are you sure?';
    };
  }

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
  const materialUITheme = createMuiTheme(theme);

  return (
    <MuiThemeProvider theme={materialUITheme}>
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
