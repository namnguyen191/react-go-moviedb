import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../../shared/types/movie';
import styles from './MoviePage.module.css';

const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'Finding Nemo',
    runtime: 120,
  },
  {
    id: '2',
    title: 'Avatar',
    runtime: 180,
  },
  {
    id: '3',
    title: 'The Conjuring',
    runtime: 120,
  },
];

const MoviePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    setMovies(mockMovies);
  }, []);

  const renderMoviesList = () => {
    return (
      <ul>
        {movies.map((movie) => {
          return (
            <li key={movie.id}>
              <Link to={`/movies/${movie.id}`}>
                <h3>{movie.title}</h3>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className={styles.moviePageContainer}>
      <h2 className={styles.title}>Choose a movie</h2>
      {renderMoviesList()}
    </div>
  );
};

export default MoviePage;
