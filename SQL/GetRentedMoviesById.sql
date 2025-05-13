IF OBJECT_ID('SP_GetRentedMoviesById', 'P') IS NOT NULL
    DROP PROCEDURE SP_GetRentedMoviesById;
GO

CREATE PROCEDURE SP_GetRentedMoviesById
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
		M.priceToRent,
		M.rentalCount
    FROM RentedMoviesTable AS RM
    INNER JOIN MoviesTable AS M ON RM.movieId = M.id
    WHERE RM.userId = @userId
		  AND RM.deletedAt IS NULL
          AND DATEDIFF(DAY, GETDATE(), RM.rentEnd) >= 0;
END
GO