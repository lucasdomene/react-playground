import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StarRating from '../../common/StarRating';
import Loader from '../../common/Loader';
import { useMovie } from '../../../hooks/useMovie';

function MovieDetails({
  watched,
  selectedId,
  onCloseMovie,
  onAddWatched,
  onDeleteWatched,
}) {
  const watchedMovie = watched.find((movie) => movie.imdbID === selectedId);
  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const [userRating, setUserRating] = useState(watchedMovie?.userRating || 0);

  const { movie, isLoading, error } = useMovie(
    selectedId,
    isWatched,
    watchedMovie
  );

  useEffect(() => {
    const closeSelectedMovie = (e) => {
      if (e.code === 'Escape') onCloseMovie();
      console.log('closing');
    };

    document.addEventListener('keydown', closeSelectedMovie);

    return () => document.removeEventListener('keydown', closeSelectedMovie);
  }, []);

  useEffect(() => {
    if (!movie.Title) return;

    document.title = `usePopcorn | ${movie.Title}`;
    return () => {
      document.title = 'usePopcorn';
    };
  }, [movie.Title]);

  const handleAdd = () => {
    if (isWatched) {
      onDeleteWatched(selectedId);
      return;
    }
    onAddWatched({ ...movie, userRating });
  };

  if (isLoading) return <Loader />;
  if (error) return <div className="error">⛔️ {error}</div>;
  if (!movie.Title) return null;

  return (
    <div className="details">
      <MovieHeader movie={movie} onClose={onCloseMovie} />
      <MovieContent
        movie={movie}
        userRating={userRating}
        isWatched={isWatched}
        onSetRating={setUserRating}
        onAddMovie={handleAdd}
      />
    </div>
  );
}

function MovieHeader({ movie, onClose }) {
  return (
    <header>
      <button className="btn-back" onClick={onClose}>
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
  );
}

function MovieContent({
  movie,
  userRating,
  isWatched,
  onSetRating,
  onAddMovie,
}) {
  return (
    <section>
      <div className="rating">
        <StarRating
          size={24}
          maxRating={10}
          defaultRating={userRating}
          onSetRating={onSetRating}
        />
        {userRating > 0 && (
          <button className="btn-add" onClick={onAddMovie}>
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
  );
}

MovieDetails.propTypes = {
  watched: PropTypes.arrayOf(
    PropTypes.shape({
      imdbID: PropTypes.string.isRequired,
      userRating: PropTypes.number,
    })
  ).isRequired,
  selectedId: PropTypes.string.isRequired,
  onCloseMovie: PropTypes.func.isRequired,
  onAddWatched: PropTypes.func.isRequired,
  onDeleteWatched: PropTypes.func.isRequired,
};

export default MovieDetails;
