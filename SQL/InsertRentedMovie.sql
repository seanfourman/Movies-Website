USE [igroup107_test2]
GO
/****** Object:  StoredProcedure [dbo].[SP_InsertMovie]    Script Date: 30/04/2025 20:29:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Insert for RentedMovies>
-- =============================================
CREATE PROCEDURE SP_InsertRentedMovie
	@userId INT,
    @movieId INT,
    @rentStart DATE,
    @rentEnd DATE,
    @totalPrice FLOAT,
    @deletedAt DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO [RentedMoviesTable] (
		[userId],
        [movieId],
        [rentStart],
        [rentEnd],
        [totalPrice],
        [deletedAt]
    )
    VALUES (
		@userId,
        @movieId,
        @rentStart,
        @rentEnd,
        @totalPrice,
        @deletedAt
    );

	UPDATE [MoviesTable]
	SET
        [rentalCount] = [rentalCount] + 1,
        [grossWorldwide] = [grossWorldwide] + @totalPrice
	WHERE [id] = @movieId;
END