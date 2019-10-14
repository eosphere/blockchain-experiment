import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { MdAccountCircle } from 'react-icons/md';
import { IoMdMoon } from 'react-icons/io';
import Tooltip from '@material-ui/core/Tooltip';
import WAL from 'eos-transit';
import AccessContextSubscribe from 'transit/AccessContextSubscribe';
import { MenuItem, Menu } from '@material-ui/core';
import Balance from './Balance';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: theme.palette.type === 'dark' && '#424242',
    color: '#fff'
  },
  menuButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  themeButton: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)
  },
  title: {
    flexGrow: 1
  },
  name: {
    fontWeight: 'bold',
    textTransform: 'Capitalize'
  },
  dialog: {
    minWidth: '300px',
    minHeight: '150px'
  }
}));

const HeaderAppBar = props => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    props.history.push('/profile');
  };

  const handleDashboard = () => {
    handleClose();
    props.history.push('/');
  };

  const handleLogout = () => {
    handleClose();
    const wallet = WAL.accessContext.getActiveWallets()[0];
    wallet.terminate().then(() => {
      localStorage.removeItem('loggedIn');
    });
  };

  const isLoggedIn = WAL.accessContext.getActiveWallets().length > 0;

  let name;
  let wallet;
  if (isLoggedIn) {
    wallet = WAL.accessContext.getActiveWallets()[0];
    if (wallet.accountInfo) {
      name = wallet.accountInfo.account_name;
    }
  }

  const {
    toggleTheme,
    history: {
      location: { pathname }
    }
  } = props;

  return (
    <AccessContextSubscribe>
      {() => (
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            {/* {isLoggedIn && (
              <IconButton className={classes.menuButton} color="inherit" aria-label="menu">
                <MdMenu />
              </IconButton>
            )} */}
            <Typography variant="h6" className={classes.title}>
              The Lott
            </Typography>
            <Tooltip title="Toggle Dark Mode" aria-label="theme">
              <IconButton className={classes.themeButton} color="inherit" onClick={toggleTheme}>
                <IoMdMoon />
              </IconButton>
            </Tooltip>
            {isLoggedIn && (
              <>
                {name && <Balance wallet={wallet} />}
                <Typography variant="body1" className={classes.name}>
                  {name}
                </Typography>
                <Tooltip title="Account Menu" aria-label="account">
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    className={classes.menuButton}>
                    <MdAccountCircle />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={open}
                  onClose={handleClose}>
                  {pathname.includes('profile') ? (
                    <MenuItem onClick={handleDashboard}>Dashboard</MenuItem>
                  ) : (
                    <MenuItem onClick={handleProfile}>My Profile</MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </AccessContextSubscribe>
  );
};

export default withRouter(HeaderAppBar);
