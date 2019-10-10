import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Appbar from './Appbar';
import Copyright from './Copyright';

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
          <Copyright />
        </main>
      </div>
    </>
  );
};

export default MainLayout;
