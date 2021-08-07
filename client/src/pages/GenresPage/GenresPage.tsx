import { Box, Chip } from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleGlobalLoader from '../../shared/components/Loaders/SimpleGlobalLoader';
import styles from './GenresPage.module.css';

type GenresPageState = {
  genres: {
    id: number;
    genre_name: string;
  }[];
  err: boolean;
  loaded: boolean;
};

const initialState: GenresPageState = {
  genres: [],
  err: false,
  loaded: false,
};

const GenresPage: React.FC = () => {
  const [state, setState] = useState<GenresPageState>(initialState);

  useEffect(() => {
    axios
      .get<{ genres: { genre_name: string; id: number }[] }>(
        'http://localhost:4000/v1/genres'
      )
      .then((res) => {
        console.log(res);

        setState((oldState) => {
          return {
            ...oldState,
            genres: res.data.genres,
            loaded: true,
          };
        });
      })
      .catch((err) => {
        console.log('Error fetching API: ', err);

        setState((oldState) => {
          return {
            ...oldState,
            loaded: true,
            err: true,
          };
        });
      });
  }, []);

  const renderGenresList = () => {
    return (
      <Box display="flex" gridGap={20}>
        {state.genres.map((genre) => {
          return (
            <Link
              key={genre.id}
              to={{
                pathname: `/genre/${genre.id}`,
                state: {
                  genreName: genre.genre_name,
                },
              }}
            >
              <Chip onClick={() => {}} label={genre.genre_name} />
            </Link>
          );
        })}
      </Box>
    );
  };

  if (state.err) {
    return (
      <h2 className={styles.moviePageContainer}>
        Something went wrong! Please reload this page or try again later.
      </h2>
    );
  }

  if (!state.loaded) {
    return <SimpleGlobalLoader />;
  }

  return <div className={styles.genresPageContainer}>{renderGenresList()}</div>;
};

export default GenresPage;
