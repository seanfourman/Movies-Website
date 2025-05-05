SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Delete for Users>
-- =============================================
CREATE PROCEDURE SP_DeleteUser
    @id INT
AS
BEGIN
    -- SET NOCOUNT ON;

    UPDATE [UsersTable]
    SET
        [deletedAt] = GETDATE()
    WHERE [id] = @id;
END
GO
