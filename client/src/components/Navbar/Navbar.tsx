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
import { useState } from 'react';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    menuButton: {
      marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    list: {
      width: 250
    },
    fullList: {
      width: 'auto'
    }
  })
);

const normalLinks: { text: string; path: string }[] = [
  {
    text: 'Home',
    path: '/'
  },
  {
    text: 'Movies',
    path: '/movies'
  },
  {
    text: 'Genres',
    path: '/movies/genres'
  }
];

const adminLinks: { text: string; path: string }[] = [
  {
    text: 'Admin',
    path: '/admin'
  },
  {
    text: 'Add/Edit Movie',
    path: '/admin/movie/0'
  }
];

const Navbar: React.FC = () => {
  const classes = useStyles();
  const [navOpenState, setNavOpenState] = useState(false);

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
        {adminLinks.map((link, index) => (
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
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Navbar;
