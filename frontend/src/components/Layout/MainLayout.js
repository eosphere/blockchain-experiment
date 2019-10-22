import React from 'react';
import { Container, makeStyles } from '@material-ui/core';
import { Appbar } from './Header';
import Footer from './Footer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    minHeight: '90vh',
    overflow: 'auto',
    paddingBottom: theme.spacing(4)
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2)
  }
}));

const MainLayout = ({ toggleTheme, children }) => {
  const classes = useStyles();
  return (
    <>
      <Appbar toggleTheme={toggleTheme} />
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            {children}
          </Container>
          <Footer />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
