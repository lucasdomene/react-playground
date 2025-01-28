import PropTypes from 'prop-types';
import StarRating from '../../common/StarRating';

export function MovieContent({
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

MovieContent.propTypes = {
  movie: PropTypes.object.isRequired,
  userRating: PropTypes.number.isRequired,
  isWatched: PropTypes.bool.isRequired,
  onSetRating: PropTypes.func.isRequired,
  onAddMovie: PropTypes.func.isRequired,
};
