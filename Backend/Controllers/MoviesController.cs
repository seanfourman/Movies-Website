using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace IMDBTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        // POST api/<MovieController>
        [HttpPost]
        public int Post([FromBody] Movie movie)
        {
            return movie.Insert();
        }

        // GET: api/<MoviesController>
        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            return Movie.Read();

        }

        // GET: api/Movies/getRentedMovies/{id}
        [HttpGet("getRentedMovies/{id}")]
        public IEnumerable<RentedMovieDto> GetRentedMovies(int id)
        {
            // Need to come back to this later (***)
            List<Movie> movies = Movie.ReadRentedMovies(id);
            List<RentedMovieDto> rentedMovieDtos = movies.Select(movie => new RentedMovieDto(movie)).ToList();
            return rentedMovieDtos;
        }

        // GET: api/Movies/searchByTitle
        [HttpGet("searchByTitle")]
        public ActionResult<Movie> GetByTitle(string title)
        {
            var movie = Movie.GetByTitle(title);
            if (movie == null)
                return NotFound($"No movies found with title '{title}'");
            return Ok(movie);
        }

        // GET: api/Movies/searchByTitle
        [HttpGet("searchByReleaseDate")]
        public ActionResult<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate)
        {
            var movie = Movie.GetByReleaseDate(startDate, endDate);
            if (movie == null)
                return NotFound($"No movies found between {startDate} and {endDate}");
            return Ok(movie);
        }

        // PUT api/Movies/{id}
        [HttpPut("{id}")]
        public int Put([FromBody] Movie movie, int id)
        {
            return movie.Update(id);
        }

        // DELETE api/Movies/{id}
        [HttpDelete("{id}")]
        public int Delete(int id)
        {
            Movie movie = new Movie();
            return movie.Delete(id);
        }

        /*
        // Get by Routing
        [HttpGet("searchByReleaseDate/startDate/{startDate}/endDate/{endDate}")]
        public IEnumerable<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate)
        {
            return new List<Movie>();
        }
        */
    }

    public class RentedMovieDto
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
        //public int RentIsFinished { get; set; }

        public RentedMovieDto() { }

        public RentedMovieDto(Movie movie)
        {
            Id = movie.Id;
            Url = movie.Url;
            PrimaryTitle = movie.PrimaryTitle;
            Description = movie.Description;
            PrimaryImage = movie.PrimaryImage;
            Year = movie.Year;
            ReleaseDate = movie.ReleaseDate;
            Language = movie.Language;
            Budget = movie.Budget;
            GrossWorldwide = movie.GrossWorldwide;
            Genres = movie.Genres;
            IsAdult = movie.IsAdult;
            RuntimeMinutes = movie.RuntimeMinutes;
            AverageRating = movie.AverageRating;
            NumVotes = movie.NumVotes;
            // RentIsFinished = movie.RentIsFinished;
        }
    }
}