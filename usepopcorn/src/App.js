import { useEffect, useState } from 'react';
import Main from './components/Main';
import NavBar from './components/NavBar';
import MovieList from './components/MovieList';
import Search from './components/Search';
import MovieResultCount from './components/MovieResultCount';

import Box from './components/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedMovieList from './components/WatchedMovieList';
import MovieDetails from './components/MovieDetails';

const KEY = process.env.REACT_APP_OMDB_API_KEY;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError('');
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );

        if (!res.ok) {
          throw new Error('Something went wrong with fetching movies');
        }

        const data = await res.json();

        if (data.Response === 'False') throw new Error('Movie not found');

        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
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
  }, [query]);

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
                onCloseMovie={() => setSelectedId(null)}
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

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔</span> {message}
    </p>
  );
}
