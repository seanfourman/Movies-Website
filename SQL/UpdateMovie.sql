SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Update for Movies>
-- =============================================
CREATE PROCEDURE SP_UpdateMovie
    @id INT,
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
    @rentalCount INT
AS
BEGIN
    -- SET NOCOUNT ON;

    UPDATE [MoviesTable]
    SET 
        [url] = @url,
        [primaryTitle] = @primaryTitle,
        [description] = @description,
        [primaryImage] = @primaryImage,
        [year] = @year,
        [releaseDate] = @releaseDate,
        [language] = @language,
        [budget] = @budget,
        [grossWorldwide] = @grossWorldwide,
        [genres] = @genres,
        [isAdult] = @isAdult,
        [runtimeMinutes] = @runtimeMinutes,
        [averageRating] = @averageRating,
        [numVotes] = @numVotes,
        [priceToRent] = @priceToRent,
        [rentalCount] = @rentalCount
    WHERE [id] = @id;
END
GO
