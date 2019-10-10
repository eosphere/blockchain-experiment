import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { MdMenu } from 'react-icons/md';
import { IoMdMoon } from 'react-icons/io';
import Tooltip from '@material-ui/core/Tooltip';
import WAL from 'eos-transit';
import AccessContextSubscribe from '../transit/AccessContextSubscribe';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: theme.palette.type === 'dark' && '#424242',
    color: '#fff'
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  themeButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  dialog: {
    minWidth: '300px',
    minHeight: '150px'
  }
}));

export default function HeaderAppBar({ toggleTheme }) {
  const classes = useStyles();

  const handleLogout = () => {
    const wallet = WAL.accessContext.getActiveWallets()[0];
    wallet.terminate();
  };

  const isLoggedIn = WAL.accessContext.getActiveWallets().length > 0;

  return (
    <AccessContextSubscribe>
      {() => (
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            {isLoggedIn && (
              <IconButton className={classes.menuButton} color="inherit" aria-label="menu">
                <MdMenu />
              </IconButton>
            )}
            <Typography variant="h6" className={classes.title}>
              The Lott
            </Typography>
            <Tooltip title="Toggle Dark Mode" aria-label="theme">
              <IconButton className={classes.themeButton} color="inherit" onClick={toggleTheme}>
                <IoMdMoon />
              </IconButton>
            </Tooltip>
            {isLoggedIn && (
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}
    </AccessContextSubscribe>
  );
}
