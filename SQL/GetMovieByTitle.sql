IF OBJECT_ID('SP_GetMovieByTitle', 'P') IS NOT NULL
    DROP PROCEDURE SP_GetMovieByTitle;
GO

CREATE PROCEDURE SP_GetMovieByTitle
    @primaryTitle NVARCHAR(255),
    @Offset INT,
    @Count INT
AS
BEGIN
    SELECT *
    FROM MoviesTable
    WHERE deletedAt IS NULL
      AND primaryTitle LIKE '%' + @primaryTitle + '%'
    ORDER BY id
    OFFSET @Offset ROWS
    FETCH NEXT @Count ROWS ONLY;
END
GO