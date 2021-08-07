import { List, ListItem, ListItemText } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SimpleGlobalLoader from '../../shared/components/Loaders/SimpleGlobalLoader';
import { Movie } from '../../shared/types/movie';
import styles from './OneGenrePage.module.css';

type OneGenrePageState = {
  loaded: boolean;
  err: boolean;
  genreName: string;
  movies: Movie[];
};

const initialState: OneGenrePageState = {
  loaded: false,
  err: false,
  genreName: '',
  movies: [],
};

const OneGenrePage: React.FC = () => {
  const [state, setState] = useState<OneGenrePageState>(initialState);
  const { id: genreId } = useParams<{ id: string }>();
  const location = useLocation<{ genreName: string }>();

  useEffect(() => {
    axios
      .get<{ movies: Movie[] }>(`http://localhost:4000/v1/movies/${genreId}`)
      .then((res) => {
        setState((oldState) => {
          return {
            ...oldState,
            movies: res.data.movies,
            loaded: true,
          };
        });
      })
      .catch((err) => {
        console.log('Error fetching API: ', err);

        setState((oldState) => {
          return {
            ...oldState,
            error: true,
          };
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMoviesList = () => {
    if (!state.movies) {
      return;
    }
    return (
      <List>
        {state.movies.map((movie) => {
          return (
            <Link key={movie.id} to={`/movies/${movie.id}`}>
              <ListItem button>
                <ListItemText primary={movie.title} />
              </ListItem>
            </Link>
          );
        })}
      </List>
    );
  };

  if (state.err) {
    return (
      <h2 className={styles.OneGenrePageContainer}>
        Something went wrong! Please reload this page or try again later.
      </h2>
    );
  }

  if (!state.loaded) {
    return <SimpleGlobalLoader />;
  }

  return (
    <div className={styles.OneGenrePageContainer}>
      <h2>{location.state.genreName} Movies</h2>
      {renderMoviesList()}
    </div>
  );
};

export default OneGenrePage;
