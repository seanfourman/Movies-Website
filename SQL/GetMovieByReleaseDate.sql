CREATE PROCEDURE SP_GetMovieByReleaseDate
    @startDate DATETIME,
    @endDate DATETIME,
    @Offset INT,
    @Count INT
AS
BEGIN
    SELECT *
    FROM MoviesTable
    WHERE releaseDate BETWEEN @startDate AND @endDate
    ORDER BY releaseDate DESC
    OFFSET @Offset ROWS
    FETCH NEXT @Count ROWS ONLY;
END