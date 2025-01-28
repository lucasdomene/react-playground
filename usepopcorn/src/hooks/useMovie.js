import { useState, useEffect } from 'react';
import { KEY, OMDB_API_URL } from '../constants';

export function useMovie(selectedId, isWatched, watchedMovie) {
  const [movie, setMovie] = useState(watchedMovie ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (watchedMovie) {
      setMovie(watchedMovie);
      return;
    }

    const fetchMovie = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(
          `${OMDB_API_URL}?i=${selectedId}&apikey=${KEY}`
        );
        if (!res.ok) throw new Error('Failed to fetch movie details');

        const data = await res.json();
        if (data.Response === 'False') throw new Error(data.Error);

        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovie();
  }, [selectedId, watchedMovie]);

  return { movie, isLoading, error };
}
