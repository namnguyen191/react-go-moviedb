import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import GraphQL from '../GraphQL/GraphQL';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    headingContainer: {
      textAlign: 'center',
    },
  })
);

const HomePage: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} className={classes.headingContainer}>
          <h2>This is the home page</h2>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <GraphQL />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;
