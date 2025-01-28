import PropTypes from 'prop-types';

export function MovieHeader({ movie, onClose }) {
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

MovieHeader.propTypes = {
  movie: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
