IF OBJECT_ID('SP_GetMovieByReleaseDate', 'P') IS NOT NULL
    DROP PROCEDURE SP_GetMovieByReleaseDate;
GO

CREATE PROCEDURE SP_GetMovieByReleaseDate
    @startDate DATETIME,
    @endDate DATETIME,
    @Offset INT,
    @Count INT
AS
BEGIN
    SELECT *
    FROM MoviesTable
    WHERE deletedAt IS NULL
      AND releaseDate BETWEEN @startDate AND @endDate
    ORDER BY releaseDate DESC
    OFFSET @Offset ROWS
    FETCH NEXT @Count ROWS ONLY;
END
GO