import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import CustomFormControl from '../../components/FormControl/CustomFormControl';
import styles from './AdminMovie.module.css';

type MoviePayload = {
  title: string;
  release_date: Date;
  mpaa_rating: MPAARatings;
  description: string;
  rating: number;
};

enum MPAARatings {
  G = 'G',
  PG = 'PG',
  PG13 = 'PG13',
  R = 'R',
  NC17 = 'NC17',
}

const AdminMovie: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const history = useHistory();

  const mode = id === '0' ? 'add' : 'edit';
  const [movie, setMovie] = useState<MoviePayload>({
    title: '',
    release_date: new Date(),
    mpaa_rating: MPAARatings.G,
    description: 'Please provide a description for this movie',
    rating: 0,
  });

  useEffect(() => {
    axios
      .get<{ movie: MoviePayload | null }>(
        `http://localhost:4000/v1/movie/${id}`
      )
      .then((res) => {
        if (res.data.movie) {
          setMovie(res.data.movie);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (date: Date | null) => {
    setMovie((oldMovieState) => ({
      ...oldMovieState,
      release_date: date ?? new Date(),
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovie((oldMovieState) => ({
      ...oldMovieState,
      [event.target.name]: event.target.value,
    }));
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const confirmDelete = () => {
    const jwtKey = localStorage.getItem(
      process.env.REACT_APP_JWT_LOCAL_STORAGE_KEY ?? 'please_provide_a_key'
    );

    if (!jwtKey) {
      throw new Error('Fail to get JWT key, please login again');
    }

    axios
      .delete(`http://localhost:4000/v1/admin/deletemovie/${id}`, {
        headers: { Authorization: `Bearer ${jwtKey}` },
      })
      .then((res) => {
        history.push('/admin');
        console.log(res);
      })
      .catch((err) => console.log(err));
    setOpen(false);
  };

  const handleSubmit = () => {
    const jwtKey = localStorage.getItem(
      process.env.REACT_APP_JWT_LOCAL_STORAGE_KEY ?? 'please_provide_a_key'
    );

    if (!jwtKey) {
      throw new Error('Fail to get JWT key, please login again');
    }

    axios
      .post('http://localhost:4000/v1/admin/editmovie', movie, {
        headers: { Authorization: `Bearer ${jwtKey}` },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container maxWidth="md" className={styles.AdminMovieContainer}>
      <Typography variant="h2" gutterBottom>
        Add/ Edit Movie
      </Typography>

      <Box display="flex" gridGap={30} flexDirection="column">
        <CustomFormControl
          id="title"
          name="title"
          onChangeHandler={handleChange}
          autoComplete="off"
          helperText="The title of the movie"
          title="Title"
          value={movie.title}
        />
        <CustomFormControl
          datePicker
          handleDateChange={handleDateChange}
          initialDate={movie.release_date}
        />
        <CustomFormControl
          enumType={MPAARatings}
          helperText="Please select a MPAA Rating"
          label="MPAA Rating"
          name="mpaaRating"
          onChangeHandler={handleChange}
          value={movie.mpaa_rating}
        />
        <FormControl fullWidth>
          <TextField
            label="Rating"
            type="number"
            value={movie.rating}
            name="rating"
            onChange={handleChange}
          />
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Description"
            multiline
            rows={6}
            value={movie.description}
            variant="outlined"
            name="description"
            onChange={handleChange}
          />
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {mode === 'edit' && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClickOpen}
          >
            Delete
          </Button>
        )}
      </Box>
      <Dialog open={open} aria-labelledby="draggable-dialog-title">
        <DialogTitle id="draggable-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {movie.title}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="secondary">
            Delete Movie
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminMovie;
