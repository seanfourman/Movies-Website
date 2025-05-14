SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <14/05/2025>
-- Description:	<Stored Procedure to Reset Movie Database>
-- =============================================
CREATE PROCEDURE SP_ResetMovieDatabase
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM [RentedMoviesTable];
    DELETE FROM [MoviesTable];
    DBCC CHECKIDENT ('[MoviesTable]', RESEED, 0);
    SELECT 'Movie database has been reset successfully' AS Result;
END
GO