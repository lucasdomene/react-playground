import { useEffect, useState } from 'react';
import Main from './components/Main';
import NavBar from './components/NavBar';
import MovieList from './components/MovieList';
import Search from './components/Search';
import MovieResultCount from './components/MovieResultCount';

import Box from './components/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedMovieList from './components/WatchedMovieList';

const KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('interstellar');

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );
      const data = await res.json();
      setMovies(data.Search);
      setIsLoading(false);
    };
    fetchMovies();
  }, [query]);

  return (
    <>
      <NavBar>
        <Search />
        <MovieResultCount movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? <Loader /> : <MovieList movies={movies} />}
          <MovieList movies={movies} />
        </Box>
        <Box>
          <WatchedSummary watched={watched} />
          <WatchedMovieList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
