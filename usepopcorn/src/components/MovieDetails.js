import { useEffect, useState } from 'react';
import StarRating from './StarRating';

const KEY = process.env.REACT_APP_OMDB_API_KEY;

function MovieDetails({ selectedId, onCloseMovie }) {
  const [movie, setMovie] = useState({});

  useEffect(() => {
    async function getMovieDetails() {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${selectedId}&apikey=${KEY}`
      );
      const data = await res.json();
      setMovie(data);
    }
    getMovieDetails();
  }, [selectedId]);

  return (
    <div className="details">
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
          <StarRating size={24} maxRating={10} />
        </div>
        <p>
          <em>{movie.Plot}</em>
        </p>
        <p>Starring {movie.Actors}</p>
        <p>Directed by {movie.Director}</p>
      </section>
    </div>
  );
}

export default MovieDetails;
