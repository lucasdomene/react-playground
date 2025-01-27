import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Loader from './Loader';
const KEY = process.env.REACT_APP_OMDB_API_KEY;

function MovieDetails({
  watched,
  selectedId,
  onCloseMovie,
  onAddWatched,
  onDeleteWatched,
}) {
  const watchedMovie = watched.find((movie) => movie.imdbID === selectedId);
  const isWatched = watched.some((movie) => movie.imdbID === selectedId);

  const [movie, setMovie] = useState(watchedMovie ?? {});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(watchedMovie?.userRating || 0);

  useEffect(() => {
    async function getMovieDetails() {
      if (isWatched) {
        return;
      }

      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();
  }, [selectedId, watched]);

  function handleClick() {
    if (isWatched) {
      onDeleteWatched(selectedId);
    } else {
      onAddWatched({ ...movie, userRating });
    }
  }

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`${movie.Title} poster`} />

            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie.imdbRating} IMDb rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              <StarRating
                size={24}
                maxRating={10}
                defaultRating={userRating}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="btn-add" onClick={handleClick}>
                  {isWatched ? 'Remove from list' : 'Add to list'}
                </button>
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring {movie.Actors}</p>
            <p>Directed by {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default MovieDetails;
