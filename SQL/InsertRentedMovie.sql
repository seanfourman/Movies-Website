-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
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
    @movieId INT
AS
BEGIN
    SET NOCOUNT ON;

	INSERT INTO [RentedMoviesTable] (
		[userId],
		[movieId]
	)
    VALUES (
        @userId,
        @movieId
    );
END
GO

