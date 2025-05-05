SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Delete Movie>
-- =============================================
CREATE PROCEDURE SP_DeleteMovie
    @id INT
AS
BEGIN
    -- SET NOCOUNT ON;

    UPDATE [MoviesTable]
    SET
        [deletedAt] = GETDATE()
    WHERE [id] = @id;
END
GO
