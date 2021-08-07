import {
  Box,
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from '@material-ui/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomFormControl from '../../components/FormControl/CustomFormControl';
import styles from './AdminMovie.module.css';

type MoviePayload = {
  title: string;
  release_date: string;
  mpaa_rating: MPAARatings;
  description: string;
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

  const [movie, setMovie] = useState<MoviePayload>({
    title: '',
    release_date: new Date().toLocaleDateString(),
    mpaa_rating: MPAARatings.G,
    description: 'Please provide a description for this movie',
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
      releaseDate: date?.toLocaleDateString().toString() ?? '',
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMovie((oldMovieState) => ({
      ...oldMovieState,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Container maxWidth="md" className={styles.AdminAovieContainer}>
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
          initialDate={new Date(Date.parse(movie.release_date))}
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
            label="Description"
            multiline
            rows={6}
            defaultValue={movie.description}
            variant="outlined"
            name="description"
            onChange={handleChange}
          />
        </FormControl>
        <Button variant="contained" color="primary" size="medium">
          Submit
        </Button>
      </Box>
      {JSON.stringify(movie)}
    </Container>
  );
};

export default AdminMovie;
