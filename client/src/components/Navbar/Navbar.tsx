import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type NavbarProps = {
  setAppAuth?: (auth: boolean) => void;
};

type AuthState = {
  jwt: string | null;
};

const initialAuthState: AuthState = {
  jwt: null,
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
  })
);

const normalLinks: { text: string; path: string }[] = [
  {
    text: 'Home',
    path: '/',
  },
  {
    text: 'Movies',
    path: '/movies',
  },
  {
    text: 'Genres',
    path: '/movies/genres',
  },
];

const adminLinks: { text: string; path: string }[] = [
  {
    text: 'Admin',
    path: '/admin',
  },
  {
    text: 'Add/Edit Movie',
    path: '/admin/movie/0',
  },
];

const Navbar: React.FC<NavbarProps> = (props) => {
  const { setAppAuth } = props;
  const classes = useStyles();
  const [navOpenState, setNavOpenState] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [invalidCredentialsDialog, setInvalidCredentialsDialog] =
    useState(false);
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [authCreds, setAuthCreds] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });

  const renderAuthButtons = (): JSX.Element => {
    // Render login button if there's no jwt
    // else render the logout button
    if (!authState.jwt) {
      return (
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => setDialogOpen(true)}
        >
          Login
        </Button>
      );
    } else {
      return (
        <Button variant="outlined" color="inherit" onClick={logout}>
          Logout
        </Button>
      );
    }
  };

  const login = () => {
    axios
      .post<{ response: string }>('http://localhost:4000/v1/signin', {
        user_name: authCreds.email,
        password: authCreds.password,
      })
      .then((res) => {
        console.log(res.data);

        setAuthState((oldAuthState) => ({
          ...oldAuthState,
          jwt: res.data.response,
        }));
        localStorage.setItem(
          process.env.REACT_APP_JWT_LOCAL_STORAGE_KEY ??
            'please_set_key_in_env',
          res.data.response
        );
        if (setAppAuth) {
          setAppAuth(true);
        }
        setDialogOpen(false);
      })
      .catch((err) => {
        setInvalidCredentialsDialog(true);
      });
  };

  const logout = () => {
    setAuthState((oldAuthState) => ({ ...oldAuthState, jwt: null }));
    localStorage.removeItem(
      process.env.REACT_APP_JWT_LOCAL_STORAGE_KEY ?? 'please_set_key_in_env'
    );
    setAuthCreds({ email: '', password: '' });
    if (setAppAuth) {
      setAppAuth(false);
    }
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setNavOpenState(open);
    };

  useEffect(() => {
    const jwtKey = localStorage.getItem(
      process.env.REACT_APP_JWT_LOCAL_STORAGE_KEY ?? 'please_set_key_in_env'
    );

    if (jwtKey) {
      setAuthState((oldAuthState) => ({ ...oldAuthState, jwt: jwtKey }));
    }
  }, []);

  const list = () => (
    <div>
      <List>
        {normalLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={toggleDrawer(false)}>
            <ListItem button>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {authState.jwt &&
          adminLinks.map((link, index) => (
            <Link key={index} to={link.path} onClick={toggleDrawer(false)}>
              <ListItem button>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={link.text} />
              </ListItem>
            </Link>
          ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <Drawer anchor="left" open={navOpenState} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Go Watch A Movie!
          </Typography>
          {renderAuthButtons()}
        </Toolbar>
      </AppBar>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            autoComplete="off"
            value={authCreds.email}
            onChange={(e) =>
              setAuthCreds((oldAuthCred) => ({
                ...oldAuthCred,
                email: e.target.value,
              }))
            }
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            autoComplete="off"
            value={authCreds.password}
            onChange={(e) =>
              setAuthCreds((oldAuthCred) => ({
                ...oldAuthCred,
                password: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={login} color="primary">
            Login
          </Button>
        </DialogActions>
        <Dialog
          onClose={() => setInvalidCredentialsDialog(false)}
          aria-labelledby="invalid-credentials"
          open={invalidCredentialsDialog}
        >
          <DialogTitle id="invalid-credentials" style={{ color: 'red' }}>
            Invalid Credentials!
          </DialogTitle>
        </Dialog>
      </Dialog>
    </div>
  );
};

export default Navbar;
