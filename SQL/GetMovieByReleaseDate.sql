SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:       Noa Yarin Levi
-- Create date:  26/04/2025
-- Description:  Stored Procedure Select for Rented Movies
-- =============================================
CREATE PROCEDURE SP_GetMovieByReleaseDate
    @startDate DATE,
	@endDate DATE
AS
BEGIN
    -- SET NOCOUNT ON;

    SELECT *
    FROM [MoviesTable]
	WHERE releaseDate >= @startDate AND releaseDate <= @endDate
END
GO