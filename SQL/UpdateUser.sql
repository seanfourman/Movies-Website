SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Noa Yarin Levi>
-- Create date: <26/04/2025>
-- Description:	<Stored Procedure Update for Movies>
-- =============================================
CREATE PROCEDURE SP_UpdateUser
    @id INT,
	@name NVARCHAR(30),
	@email NVARCHAR(255),
	@password NVARCHAR(255),
	@active BIT,
	@admin BIT
AS
BEGIN
    -- SET NOCOUNT ON;

    UPDATE [UsersTable]
    SET 
        [name] = @name,
        [email] = @email,
        [password] = @password,
		[active] = @active,
		[admin] = @admin
    WHERE [id] = @id;
END
GO
