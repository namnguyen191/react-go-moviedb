import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Typography
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SimpleGlobalLoader from '../../components/Loaders/SimpleGlobalLoader';
import { Movie } from '../../shared/types/movie';
import styles from './MovieDetailPage.module.css';

type MovieDetailState = {
  movie: Movie | null;
  loaded: boolean;
  error: boolean;
};

const initialState: MovieDetailState = {
  movie: null,
  loaded: false,
  error: false
};

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [state, setState] = useState<MovieDetailState>(initialState);

  useEffect(() => {
    axios
      .get<{ movie: Movie }>(`http://localhost:4000/v1/movie/${id}`)
      .then((res) => {
        console.log(res);

        setState((oldState) => {
          return {
            ...oldState,
            movie: res.data.movie,
            loaded: true
          };
        });
      })
      .catch((err) => {
        console.log('Error fetching API: ', err);

        setState((oldState) => {
          return {
            ...oldState,
            error: true
          };
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.error) {
    return (
      <h2 className={styles.moviePageContainer}>
        Something went wrong! Please reload this page or try again later.
      </h2>
    );
  }

  if (!state.loaded) {
    return <SimpleGlobalLoader />;
  }

  const renderMPAARating: () => JSX.Element = () => {
    switch (state.movie?.mpaa_rating) {
      case 'R':
        return <Chip label={state.movie?.mpaa_rating} color="secondary" />;
      case 'NC-17':
        return <Chip label={state.movie?.mpaa_rating} color="secondary" />;
      case 'PG':
        return <Chip label={state.movie?.mpaa_rating} color="primary" />;
      case 'PG-13':
        return <Chip label={state.movie?.mpaa_rating} color="primary" />;
      case 'G':
        return <Chip label={state.movie?.mpaa_rating} color="primary" />;
      default:
        return <Chip label={state.movie?.mpaa_rating} />;
    }
  };

  return (
    <div className={styles.movieDetailPageContainer}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h1" component="h2" gutterBottom>
            {state.movie?.title}
          </Typography>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gridGap={10}>
            {renderMPAARating()}
            {Object.keys(state.movie!.genres).map((genreId, i) => (
              <Chip key={i} label={state.movie?.genres[parseInt(genreId)]} />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography variant="h4">Description: </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{state.movie?.description}</Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography variant="h4">Run time: </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{state.movie?.runtime} minutes</Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </div>
  );
};

export default MovieDetailPage;
