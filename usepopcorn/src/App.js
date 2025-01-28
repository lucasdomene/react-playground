import { useEffect, useState } from 'react';
import Main from './components/common/Main';

import MovieList from './components/movie/MovieList';
import Search from './components/common/Search';
import MovieResultCount from './components/movie/MovieResultCount';

import Box from './components/common/Box';
import WatchedSummary from './components/movie/WatchedSummary';
import WatchedMovieList from './components/movie/WatchedMovieList';
import MovieDetails from './components/movie/MovieDetails/MovieDetails';
import Loader from './components/common/Loader';
import NavBar from './components/common/NavBar';

const KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error('Something went wrong with fetching movies');
        }

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not found');

        setMovies(data.Search);
        setError('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    fetchMovies();

    return () => controller.abort();
  }, [query]);

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <MovieResultCount movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              movies={movies}
              onSelectMovie={(id) =>
                setSelectedId(id === selectedId ? null : id)
              }
            />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          <>
            {selectedId ? (
              <MovieDetails
                selectedId={selectedId}
                watched={watched}
                onCloseMovie={() => setSelectedId(null)}
                onAddWatched={handleAddWatched}
                onDeleteWatched={handleDeleteWatched}
              />
            ) : (
              <>
                <WatchedSummary watched={watched} />
                <WatchedMovieList watched={watched} />
              </>
            )}
          </>
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
