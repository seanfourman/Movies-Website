IF OBJECT_ID('SP_GetMoviesBatch', 'P') IS NOT NULL
    DROP PROCEDURE SP_GetMoviesBatch;
GO

CREATE PROCEDURE SP_GetMoviesBatch
    @Offset INT,
    @Count INT
AS
BEGIN
    SELECT *
    FROM MoviesTable
    WHERE deletedAt IS NULL
    ORDER BY id
    OFFSET @Offset ROWS
    FETCH NEXT @Count ROWS ONLY;
END
GO