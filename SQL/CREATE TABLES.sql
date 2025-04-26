CREATE TABLE [MoviesTable] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [url] NVARCHAR(255) NOT NULL,
    [primaryTitle] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [primaryImage] NVARCHAR(255) NOT NULL,
    [year] INT NOT NULL,
    [releaseDate] DATE NOT NULL,
    [language] NVARCHAR(50),
    [budget] FLOAT,
    [grossWorldwide] FLOAT NOT NULL,
    [genres] NVARCHAR(255) NOT NULL,
    [isAdult] BIT NOT NULL,
    [runtimeMinutes] INT NOT NULL,
    [averageRating] FLOAT NOT NULL,
    [numVotes] INT NOT NULL,
	[deletedAt] DATE DEFAULT NULL,
	[priceToRent] INT NOT NULL,
    [rentalCount] INT NOT NULL DEFAULT 0
);

CREATE TABLE [UsersTable] (
    [id] INT IDENTITY(1,1) PRIMARY KEY,
    [name] NVARCHAR(30) NOT NULL,
	[email] NVARCHAR(255) NOT NULL,
	[password] NVARCHAR(255) NOT NULL,
	[active] BIT DEFAULT 1,
	[deletedAt] DATE DEFAULT NULL
);

CREATE TABLE [RentedMoviesTable] (
    [userId] INT NOT NULL,
    [movieId] INT NOT NULL,
    [rentStart] DATE NOT NULL,
    [rentEnd] DATE NOT NULL,
    [totalPrice] FLOAT NOT NULL,
    [deletedAt] DATE NULL,
    PRIMARY KEY ([userId], [movieId]),
    FOREIGN KEY ([userId]) REFERENCES [UsersTable]([id]) ON DELETE CASCADE,
    FOREIGN KEY ([movieId]) REFERENCES [MoviesTable]([id]) ON DELETE CASCADE
);