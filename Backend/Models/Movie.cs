namespace IMDBTask.Models
{
    public class Movie
    {
        public string Url { get; set; }
        public string PrimaryTitle { get; set; }
        public string Description { get; set; }
        public string PrimaryImage { get; set; }
        public int Year { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string Language { get; set; }
        public double Budget { get; set; }
        public double GrossWorldwide { get; set; }
        public string Genres { get; set; }
        public bool IsAdult { get; set; }
        public int RuntimeMinutes { get; set; }
        public float AverageRating { get; set; }
        public int NumVotes { get; set; }

        public Movie() { }

        public Movie(string url, string primaryTitle, string description, string primaryImage, int year,
                     DateTime releaseDate, string language, double budget, double grossWorldwide, string genres,
                     bool isAdult, int runtimeMinutes, float averageRating, int numVotes)
        {
            Url = url;
            PrimaryTitle = primaryTitle;
            Description = description;
            PrimaryImage = primaryImage;
            Year = year;
            ReleaseDate = releaseDate;
            Language = language;
            Budget = budget;
            GrossWorldwide = grossWorldwide;
            Genres = genres;
            IsAdult = isAdult;
            RuntimeMinutes = runtimeMinutes;
            AverageRating = averageRating;
            NumVotes = numVotes;
        }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.Insert(this);
        }

        /*
        public bool Insert()
        {
            if (_moviesList.Any(movie => movie.PrimaryTitle == this.PrimaryTitle))
                return false;

            this.Id = _nextId++;
            _moviesList.Add(this);
            return true;
        }
        
        public static bool Delete(int movieId)
        {
            var movieToRemove = _moviesList.FirstOrDefault(movie => movie.Id == movieId);
            if (movieToRemove == null)
                return false;

            return _moviesList.Remove(movieToRemove);
        }

        public static List<Movie> Read()
        {
            return new List<Movie>(_moviesList);
        }

        public static List<Movie> GetByTitle(string title)
        {
            return _moviesList
                .Where(movie => movie.PrimaryTitle.ToLower().Contains(title.ToLower()))
                .ToList();
        }

        public static List<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate)
        {
            return _moviesList
                .Where(movie => movie.ReleaseDate >= startDate && movie.ReleaseDate <= endDate)
                .ToList();
        }
        */
    }
}