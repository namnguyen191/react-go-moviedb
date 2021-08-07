import { Container } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import styles from './App.module.css';
import Navbar from './components/Navbar/Navbar';
import AdminMovie from './pages/AdminMovie/AdminMovie';
import AdminPage from './pages/AdminPage/AdminPage';
import GenresPage from './pages/GenresPage/GenresPage';
import HomePage from './pages/HomePage/HomePage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import MoviePage from './pages/MoviePage/MoviePage';
import OneGenrePage from './pages/OneGenrePage/OneGenrePage';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <Navbar />

      <Container maxWidth="xl">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/movies" exact component={MoviePage} />
          <Route path="/movies/genres" exact component={GenresPage} />
          <Route path="/movies/:id" exact component={MovieDetailPage} />
          <Route path="/genre/:id" exact component={OneGenrePage} />
          <Route path="/admin" exact component={AdminPage} />
          <Route path="/admin/movie/:id" exact component={AdminMovie} />
          <Route path="/">
            <h1>Page not found</h1>
          </Route>
        </Switch>
      </Container>
    </div>
  );
};

export default App;
