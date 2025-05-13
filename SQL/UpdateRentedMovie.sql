SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Update for Movies>
-- =============================================
CREATE PROCEDURE SP_UpdateRentedMovie
    @senderId INT,
	@movieId INT,
	@receiverId INT
AS
BEGIN
    -- SET NOCOUNT ON;

    UPDATE [RentedMoviesTable]
    SET 
        [userId] = @receiverId
    WHERE [userId] = @senderId AND [movieId] = @movieId;
END
GO
