import { List, ListItem, ListItemText, Typography } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleGlobalLoader from '../../shared/components/Loaders/SimpleGlobalLoader';
import { Movie } from '../../shared/types/movie';
import styles from './AdminPage.module.css';

type AdminPageState = {
  movies: Movie[];
  loaded: boolean;
  error: boolean;
};

const initialAdminPageState: AdminPageState = {
  movies: [],
  loaded: false,
  error: false,
};

const AdminPage: React.FC = () => {
  const [state, setState] = useState<AdminPageState>(initialAdminPageState);

  useEffect(() => {
    axios
      .get<{ movies: Movie[] }>(`http://localhost:4000/v1/movies/`)
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
      <List dense>
        {state.movies.map((movie) => {
          return (
            <Link key={movie.id} to={`/admin/movie/${movie.id}`}>
              <ListItem>
                <ListItemText primary={movie.title} />
              </ListItem>
            </Link>
          );
        })}
      </List>
    );
  };

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

  return (
    <div className={styles.moviePageContainer}>
      <Typography variant="h2" gutterBottom>
        Movies
      </Typography>
      {renderMoviesList()}
    </div>
  );
};

export default AdminPage;
