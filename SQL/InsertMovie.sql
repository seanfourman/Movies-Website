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
-- Description:	<Stored Procedure Insert for Movies>
-- =============================================
CREATE PROCEDURE SP_InsertMovie
    @url NVARCHAR(255),
    @primaryTitle NVARCHAR(255),
    @description NVARCHAR(1000),
    @primaryImage NVARCHAR(255),
    @year INT,
    @releaseDate DATE,
    @language NVARCHAR(50),
    @budget FLOAT,
    @grossWorldwide FLOAT,
    @genres NVARCHAR(255),
    @isAdult BIT,
    @runtimeMinutes INT,
    @averageRating FLOAT,
    @numVotes INT,
    @priceToRent INT,
    @rentalCount INT = 0
AS
BEGIN
    -- SET NOCOUNT ON;

	INSERT INTO [MoviesTable] (
		[url],
		[primaryTitle],
		[description],
		[primaryImage],
		[year],
		[releaseDate],
		[language],
		[budget],
		[grossWorldwide],
		[genres],
		[isAdult],
		[runtimeMinutes],
		[averageRating],
		[numVotes],
		[priceToRent],
		[rentalCount]
	)
    VALUES (
        @url,
        @primaryTitle,
        @description,
        @primaryImage,
        @year,
        @releaseDate,
        @language,
        @budget,
        @grossWorldwide,
        @genres,
        @isAdult,
        @runtimeMinutes,
        @averageRating,
        @numVotes,
        @priceToRent,
        @rentalCount
    );
END
GO

