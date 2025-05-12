CREATE OR ALTER PROCEDURE SP_GetUniqueLanguagesAndGenres
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT LTRIM(RTRIM(language)) AS Language
    FROM MoviesTable
    WHERE language IS NOT NULL AND language <> '';

    SELECT DISTINCT LTRIM(RTRIM(genres)) AS Genre
    FROM MoviesTable
    WHERE genres IS NOT NULL AND genres <> '';
END
