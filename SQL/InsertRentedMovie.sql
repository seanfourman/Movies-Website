CREATE PROCEDURE SP_InsertRentedMovie
    @userId INT,
    @movieId INT,
    @rentStart DATE,
    @rentEnd DATE,
    @totalPrice FLOAT
AS
BEGIN
    IF EXISTS (SELECT 1 FROM [RentedMoviesTable] 
               WHERE [userId] = @userId AND [movieId] = @movieId AND [deletedAt] IS NOT NULL)
    BEGIN
        UPDATE [RentedMoviesTable]
        SET [rentStart] = @rentStart,
            [rentEnd] = @rentEnd,
            [totalPrice] = @totalPrice,
            [deletedAt] = NULL
        WHERE [userId] = @userId AND [movieId] = @movieId;
    END
    ELSE
    BEGIN
        INSERT INTO [RentedMoviesTable] (
            [userId],
            [movieId],
            [rentStart],
            [rentEnd],
            [totalPrice]
        )
        VALUES (
            @userId,
            @movieId,
            @rentStart,
            @rentEnd,
            @totalPrice
        );
    END

    UPDATE [MoviesTable]
    SET [rentalCount] = [rentalCount] + 1,
        [grossWorldwide] = [grossWorldwide] + @totalPrice
    WHERE [id] = @movieId;
END