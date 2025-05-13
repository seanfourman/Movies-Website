SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Delete Movie>
-- =============================================
CREATE PROCEDURE SP_DeleteRentedMovie
    @userId INT,
    @movieId INT
AS
BEGIN   
    UPDATE [RentedMoviesTable]
    SET
        [deletedAt] = GETDATE()
    WHERE [userId] = @userId AND [movieId] = @movieId
END
GO
