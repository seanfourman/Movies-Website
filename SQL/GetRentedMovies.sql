IF OBJECT_ID('SP_GetRentedMovies', 'P') IS NOT NULL
    DROP PROCEDURE SP_GetRentedMovies;
GO

CREATE PROCEDURE SP_GetRentedMovies
    @userId INT
AS
BEGIN
    SELECT
		M.id,
        M.primaryTitle,
        M.description,
        M.url,
        M.primaryImage,
        M.year,
        M.releaseDate,
        M.language,
        M.budget,
        M.grossWorldwide,
        M.genres,
        M.isAdult,
        M.runtimeMinutes,
        M.averageRating,
        M.numVotes,
        DATEDIFF(DAY, GETDATE(), RM.rentEnd) AS daysUntilExpiration
    FROM RentedMoviesTable AS RM
    INNER JOIN MoviesTable AS M ON RM.movieId = M.id
    WHERE RM.userId = @userId
		  AND m.deletedAt IS NULL
          AND DATEDIFF(DAY, GETDATE(), RM.rentEnd) >= 0;
END
GO