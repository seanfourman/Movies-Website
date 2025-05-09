CREATE PROCEDURE SP_GetMoviesBatch
    @Offset INT,
    @Count INT
AS
BEGIN
    SELECT *
    FROM MoviesTable
    ORDER BY id
    OFFSET @Offset ROWS
    FETCH NEXT @Count ROWS ONLY;
END