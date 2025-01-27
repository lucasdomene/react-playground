import { useEffect, useState } from 'react';
import Main from './components/Main';
import NavBar from './components/NavBar';
import MovieList from './components/MovieList';
import Search from './components/Search';
import MovieResultCount from './components/MovieResultCount';
import { tempMovieData, tempWatchedData } from './constants';
import Box from './components/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedMovieList from './components/WatchedMovieList';

const KEY = process.env.REACT_APP_API_KEY;

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);

  useEffect(() => {
    fetch(`http://img.omdbapi.com/?apikey=${KEY}&s=interstellar`)
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, [movies]);

  return (
    <>
      <NavBar>
        <Search />
        <MovieResultCount movies={movies} />
      </NavBar>
      <Main>
        <Box>
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
