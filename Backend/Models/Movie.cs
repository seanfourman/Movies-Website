using System;
using System.Collections.Generic;
using System.Linq;
using IMDBTask.Services;

namespace IMDBTask.Models
{
    public class Movie
    {
        public int Id { get; set; }
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
        public int PriceToRent { get; set; }
        public int RentalCount { get; set; }
        //public int RentIsFinished { get; set; }

        public Movie() { }

        public Movie(string url, string primaryTitle, string description, string primaryImage, int year,
                     DateTime releaseDate, string language, double budget, double grossWorldwide, string genres,
                     bool isAdult, int runtimeMinutes, float averageRating, int numVotes, int priceToRent, int rentalCount)
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
            PriceToRent = priceToRent;
            RentalCount = rentalCount;
        }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertMovie(this);
        }

        public static List<Movie> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.GetAllMovies();
        }

        public static List<Movie> GetBatch(int offset, int count)
        {
            DBservices dbs = new DBservices();
            return dbs.GetMoviesBatch(offset, count);
        }

        public static List<Movie> GetRentedMoviesById(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.GetRentedMoviesById(id);
        }

        public static List<Movie> GetByTitle(string title, int offset, int count)
        {
            DBservices dbs = new DBservices();
            return dbs.GetMovieByTitle(title, offset, count);
        }

        public static List<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate, int offset, int count)
        {
            DBservices dbs = new DBservices();
            return dbs.GetMovieByReleaseDate(startDate, endDate, offset, count);
        }

        public int Update(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateMovie(this, id);
        }

        public int Delete(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteMovie(id);
        }

        public static bool ResetMovieDatabase()
        {
            DBservices dbs = new DBservices();
            return dbs.ResetMovieDatabase();
        }
    }
}