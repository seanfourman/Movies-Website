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
-- Description:	<Stored Procedure Insert for Users>
-- =============================================
CREATE PROCEDURE SP_InsertUser
	@name NVARCHAR(30),
	@email NVARCHAR(255),
	@password NVARCHAR(255),
	@active BIT,
	@admin BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	-- SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO [UsersTable] (
		[name],
		[email],
		[password],
		[active],
		[admin]
	)
    VALUES (
        @name,
        @email,
        @password,
        @active,
		@admin
    );
END
GO
