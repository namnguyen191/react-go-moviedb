import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  TextField,
  Typography,
} from '@material-ui/core';
import { useState } from 'react';
import styles from './AdminAddMovie.module.css';

const mpaaRatings: string[] = ['G', 'PG', 'PG13', 'R', 'NC17'];

const AdminAddMovie: React.FC = () => {
  const [mpaaRating, setMPAARating] = useState<string>('G');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMPAARating(event.target.value);
  };

  return (
    <Container maxWidth="md" className={styles.AdminAddMovieContainer}>
      <Typography variant="h2" gutterBottom>
        Add/ Edit Movie
      </Typography>

      <Box display="flex" gridGap={30} flexDirection="column">
        <FormControl fullWidth>
          <InputLabel htmlFor="title">Title</InputLabel>
          <Input id="title" aria-describedby="title-helper-text" />
          <FormHelperText id="title-helper-text">
            The title of the movie
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel htmlFor="release-date">Release date</InputLabel>
          <Input
            id="release-date"
            aria-describedby="release-date-helper-text"
          />
          <FormHelperText id="release-date-helper-text">
            YYYY/MM/DD
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            select
            label="MPAA Rating"
            value={mpaaRating}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            helperText="Please select your MPAA rating"
          >
            {mpaaRatings.map((rating, i) => (
              <option key={i} value={rating}>
                {rating}
              </option>
            ))}
          </TextField>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            label="Description"
            multiline
            rows={6}
            defaultValue="Please provide a description for this movie"
            variant="outlined"
          />
        </FormControl>
        <Button variant="contained" color="primary" size="medium">
          Submit
        </Button>
      </Box>
    </Container>
  );
};

export default AdminAddMovie;
