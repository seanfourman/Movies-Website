CREATE PROCEDURE SP_GetMovieByTitle
    @primaryTitle NVARCHAR(255),
    @Offset INT,
    @Count INT
AS
BEGIN
    SELECT *
    FROM MoviesTable
    WHERE primaryTitle LIKE '%' + @primaryTitle + '%'
    ORDER BY id
    OFFSET @Offset ROWS
    FETCH NEXT @Count ROWS ONLY;
END