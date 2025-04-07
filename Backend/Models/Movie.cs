namespace IMDBTask.Models
{
    public class Movie
    {
        private static int _nextId = 0;
        public int Id { get; private set; }
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

        static List<Movie> MoviesList = new List<Movie>();

        public Movie() {
            this.Id = _nextId++;
        }

        public Movie(int id, string url, string primaryTitle, string description, string primaryImage, int year,
                     DateTime releaseDate, string language, double budget, double grossWorldwide, string genres, 
                     bool isAdult, int runtimeMinutes, float averageRating, int numVotes) : this() {
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

        public bool Insert() {
            foreach(Movie movie in MoviesList) {
                if (this.Id == movie.Id || this.PrimaryTitle == movie.PrimaryTitle)
                    return false;
            }
            MoviesList.Add(this);
            return true;
        }

        public static bool Delete(int movieId)
        {
            var movieToRemove = MoviesList.FirstOrDefault(movie => movie.Id == movieId);
            if (movieToRemove != null) {
                MoviesList.Remove(movieToRemove);
                return true;
            }
            return false;
        }

        public static List<Movie> Read() {
            return MoviesList;
        }

        public static List<Movie> GetByTitle(string title) {
            List<Movie> filteredMovies = new List<Movie>();
            foreach(Movie movie in MoviesList) {
                if (movie.PrimaryTitle.ToLower().Contains(title.ToLower()))
                    filteredMovies.Add(movie);
            }
            return filteredMovies;
        }

        public static List<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate) {
            List<Movie> filteredMovies = new List<Movie>();
            foreach (Movie movie in MoviesList) {
                if (movie.ReleaseDate >= startDate && movie.ReleaseDate <= endDate)
                    filteredMovies.Add(movie);
            }
            return filteredMovies;
        }
    }
}
