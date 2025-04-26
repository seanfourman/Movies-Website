function sendMoviesToServer() {
  movies.forEach((movie) => {
    const movieData = {
      primaryTitle: movie.primaryTitle,
      description: movie.description,
      primaryImage: movie.primaryImage,
      contentRating: movie.contentRating,
      releaseDate: movie.releaseDate,
      language: movie.language == null ? "Unknown" : movie.language,
      genres: Array.isArray(movie.genres) ? movie.genres.join(",") : movie.genres,
      year: movie.startYear,
      budget: movie.budget === null ? 0.0 : movie.budget,
      grossWorldWide: movie.grossWorldwide === null ? 0.0 : movie.grossWorldwide,
      runtimeMinutes: movie.runtimeMinutes,
      averageRating: movie.averageRating,
      numVotes: movie.numVotes,
      url: movie.url
    };

    addMovie(
      movieData,
      (response) => console.log("added movie" + response),
      (error) => console.error("error" + error)
    );
  });
}

//sendMoviesToServer();
