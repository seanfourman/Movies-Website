SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:       Noa Yarin Levi
-- Create date:  26/04/2025
-- Description:  Stored Procedure Select for Rented Movies
-- =============================================
CREATE PROCEDURE SP_GetRentedMovies
    @userId INT
AS
BEGIN
    -- SET NOCOUNT ON;

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
    WHERE
        RM.userId = @userId
        AND DATEDIFF(DAY, GETDATE(), RM.rentEnd) >= 0;
END
GO