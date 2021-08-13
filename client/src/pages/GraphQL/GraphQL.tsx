import {
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { FormEvent, useEffect, useState } from 'react';
import { Movie } from '../../shared/types/movie';
import styles from './GraphQL.module.css';

export type GraphQLProps = {};

type GraphQLStates = {
  movies: Movie[];
  isLoaded: boolean;
  error?: Error;
  alert: {
    type: string;
    message: string;
  };
  searchTerm: string;
};

const initialStates: GraphQLStates = {
  movies: [],
  isLoaded: false,
  alert: {
    type: 'd-none',
    message: 'string',
  },
  searchTerm: '',
};

const GraphQL: React.FC<GraphQLProps> = (props) => {
  const [states, setStates] = useState<GraphQLStates>(initialStates);

  useEffect(() => {
    const payload = `
      {
        list {
          id
          title
          runtime
          year
        }
      }
    `;

    axios
      .post('http://localhost:4000/v1/graphql', payload)
      .then((res) => {
        console.log(res.data.data.list);

        setStates((oldStates) => ({
          ...oldStates,
          movies: res.data.data.list,
        }));
        console.log(states);
      })
      .catch((err) => {
        console.log(err);

        setStates((oldStates) => ({ ...oldStates, error: err }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {} = props;

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = `
      {
        search(titleContains: "${states.searchTerm}") {
          id
          title
          runtime
          description
        }
      }
    `;

    axios
      .post('http://localhost:4000/v1/graphql', payload)
      .then((res) => {
        console.log(res);

        setStates((oldStates) => ({
          ...oldStates,
          movies: res.data.data.search,
        }));
        console.log(states);
      })
      .catch((err) => {
        console.log(err);

        setStates((oldStates) => ({ ...oldStates, error: err }));
      });
  };

  const renderMoviesList = (): JSX.Element => {
    return (
      <List component="nav" aria-label="secondary mailbox folders">
        {states.movies.map((mv) => (
          <ListItem key={mv.id} button>
            <ListItemText primary={mv.title} secondary={mv.year} />
          </ListItem>
        ))}
      </List>
    );
  };

  if (states.error) {
    return (
      <h2 className={styles.moviePageContainer}>
        Something went wrong! Please reload this page or try again later.
      </h2>
    );
  }

  return (
    <div className={styles.graphqlContainer}>
      <h2>GraphQL</h2>
      <hr />
      <form onSubmit={submitSearch}>
        <FormControl style={{ marginLeft: '3rem', marginTop: '3rem' }}>
          <InputLabel htmlFor="input-with-icon-adornment">
            Search for a movie
          </InputLabel>
          <Input
            id="input-with-icon-adornment"
            value={states.searchTerm}
            onChange={(e) =>
              setStates((oldStates) => ({
                ...oldStates,
                searchTerm: e.target.value,
              }))
            }
            autoComplete="off"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </FormControl>
      </form>
      <div className={styles.listGroup}>{renderMoviesList()}</div>
    </div>
  );
};

export default GraphQL;
