import { useParams } from 'react-router-dom';
import styles from './MovieDetailPage.module.css';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className={styles.movieDetailPageContainer}>
      MovieDetailPage work! Movie Id: {id}
    </div>
  );
};

export default MovieDetailPage;
