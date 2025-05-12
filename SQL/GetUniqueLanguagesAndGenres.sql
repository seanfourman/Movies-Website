CREATE OR ALTER PROCEDURE SP_GetUniqueLanguagesAndGenres
AS
BEGIN
    SET NOCOUNT ON;

    SELECT DISTINCT LTRIM(RTRIM(language)) AS Language
    FROM MoviesTable
    WHERE language IS NOT NULL AND language <> '';

    DECLARE @GenreString NVARCHAR(MAX);
    DECLARE @Genre NVARCHAR(100);

    CREATE TABLE #Genres (Genre NVARCHAR(100));

    DECLARE genre_cursor CURSOR FOR
        SELECT genres FROM MoviesTable WHERE genres IS NOT NULL;

    OPEN genre_cursor;
    FETCH NEXT FROM genre_cursor INTO @GenreString;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        WHILE CHARINDEX(',', @GenreString) > 0
        BEGIN
            SET @Genre = LTRIM(RTRIM(LEFT(@GenreString, CHARINDEX(',', @GenreString) - 1)));
            IF @Genre <> ''
                INSERT INTO #Genres (Genre) VALUES (@Genre);
            SET @GenreString = SUBSTRING(@GenreString, CHARINDEX(',', @GenreString) + 1, LEN(@GenreString));
        END

        SET @Genre = LTRIM(RTRIM(@GenreString));
        IF @Genre <> ''
            INSERT INTO #Genres (Genre) VALUES (@Genre);

        FETCH NEXT FROM genre_cursor INTO @GenreString;
    END

    CLOSE genre_cursor;
    DEALLOCATE genre_cursor;

    SELECT DISTINCT Genre FROM #Genres ORDER BY Genre;

    DROP TABLE #Genres;
END
