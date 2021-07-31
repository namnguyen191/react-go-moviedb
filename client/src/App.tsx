import { Route, Switch } from 'react-router-dom';
import styles from './App.module.css';
import Navbar from './components/Navbar/Navbar';
import AdminPage from './pages/AdminPage/AdminPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import HomePage from './pages/HomePage/HomePage';
import MovieDetailPage from './pages/MovieDetailPage/MovieDetailPage';
import MoviePage from './pages/MoviePage/MoviePage';

const App: React.FC = () => {
  return (
    <div className={styles.appContainer}>
      <Navbar />

      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/movies" exact component={MoviePage} />
        <Route path="/movies/by-category" exact component={CategoryPage} />
        <Route path="/movies/:id" exact component={MovieDetailPage} />
        <Route path="/admin" exact component={AdminPage} />
      </Switch>
    </div>
  );
};

export default App;
