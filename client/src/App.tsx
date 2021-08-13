import { Container } from '@material-ui/core';
import { useEffect, useState } from 'react';
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
import RouteGuard from './shared/components/RouteGuard/RouteGuard';

const App: React.FC = () => {
  const [authState, setAuth] = useState(false);

  const setAppAuth = (auth: boolean) => {
    setAuth(auth);
  };

  useEffect(() => {
    const jwtKey = localStorage.getItem(
      process.env.REACT_APP_JWT_LOCAL_STORAGE_KEY ?? 'please_provide_key'
    );
    if (jwtKey) {
      setAuth(true);
    }
  }, []);

  return (
    <div className={styles.appContainer}>
      <Navbar setAppAuth={setAppAuth} />
      <Container maxWidth="xl">
        <Switch>
          <Route path="/" exact component={HomePage} />
          <Route path="/movies" exact component={MoviePage} />
          <Route path="/movies/genres" exact component={GenresPage} />
          <Route path="/movies/:id" exact component={MovieDetailPage} />
          <Route path="/genre/:id" exact component={OneGenrePage} />
          <Route path="/admin" exact component={AdminPage} />
          {/* <Route path="/admin/movie/:id" exact component={AdminMovie} /> */}
          <RouteGuard
            path="/admin/movie/:id"
            component={AdminMovie}
            auth={authState}
          />
          <Route path="/">
            <h1>Page not found</h1>
          </Route>
        </Switch>
      </Container>
    </div>
  );
};

export default App;
