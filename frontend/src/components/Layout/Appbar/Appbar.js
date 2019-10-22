import React from 'react';
import {
  MenuItem,
  Menu,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Button,
  useTheme
} from '@material-ui/core';
import { MdExpandMore, MdAccountCircle, MdBrightness4, MdBrightness7 } from 'react-icons/md';
import WAL from 'eos-transit';
import AccessContextSubscribe from 'transit/AccessContextSubscribe';
import Balances from './Balances';
import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT } from 'store/actions';

const useStyles = makeStyles(theme => ({
  appBar: {
    background: theme.palette.type === 'dark' && '#424242',
    color: 'white'
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
  downArrow: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  icon: {
    width: theme.spacing(3),
    height: theme.spacing(3)
  },
  name: {
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
    textTransform: 'Capitalize'
  },
  dialog: {
    minWidth: '300px',
    minHeight: '150px'
  }
}));

const menuOriginStyle = {
  vertical: 'top',
  horizontal: 'right'
};

const HeaderAppBar = props => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    const wallet = WAL.accessContext.getActiveWallets()[0];
    dispatch({ type: LOGOUT });
    wallet.terminate().then(() => {
      localStorage.removeItem('loggedIn');
    });
  };

  const { toggleTheme } = props;
  const accountName = useSelector(state => state.currentAccount.account.name);

  return (
    <AccessContextSubscribe>
      {() => (
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              The Lott
            </Typography>
            <Tooltip title="Toggle light/dark theme" aria-label="theme">
              <IconButton className={classes.themeButton} color="inherit" onClick={toggleTheme}>
                {theme.palette.type === 'light' ? <MdBrightness4 /> : <MdBrightness7 />}
              </IconButton>
            </Tooltip>
            {accountName && (
              <>
                <Balances />
                <Tooltip title="Account Menu" enterDelay={300}>
                  <Button
                    color="inherit"
                    aria-owns="account-menu"
                    aria-haspopup="true"
                    aria-label="account-menu"
                    onClick={handleMenu}
                    data-ga-event-category="AppBar"
                    data-ga-event-action="language">
                    <MdAccountCircle className={classes.icon} />
                    <span className={classes.name}>{accountName}</span>
                    <MdExpandMore className={classes.downArrow} />
                  </Button>
                </Tooltip>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  anchorOrigin={menuOriginStyle}
                  keepMounted
                  transformOrigin={menuOriginStyle}>
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

export default HeaderAppBar;
