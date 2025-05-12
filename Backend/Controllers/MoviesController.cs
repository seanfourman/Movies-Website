using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using IMDBTask.Services;

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
        
        // GET: api/Movies/getUniqueLanguagesAndGenres
        [HttpGet("getUniqueLanguagesAndGenres")]
        public IActionResult GetUniqueLanguagesAndGenres()
        {
            try
            {
                DBservices db = new DBservices();
                var result = db.GetUniqueLanguagesAndGenres();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        
        // GET: api/Movies/batch/{offset}/{count}
        [HttpGet("batch/{offset}/{count}")]
        public ActionResult<IEnumerable<Movie>> GetMoviesBatch(int offset, int count)
        {
            if (offset < 0 || count < 1 || count > 100)
            {
                return BadRequest("Invalid batch parameters");
            }

            var movies = Movie.GetBatch(offset, count);
            return Ok(movies);
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
        public ActionResult<IEnumerable<Movie>> GetByTitle(string title, int offset = 0, int count = 20)
        {
            var movies = Movie.GetByTitle(title, offset, count);
            return Ok(movies ?? new List<Movie>());
        }

        // GET: api/Movies/searchByTitle
        [HttpGet("searchByReleaseDate")]
        public ActionResult<IEnumerable<Movie>> GetByReleaseDate(DateTime startDate, DateTime endDate, int offset = 0, int count = 20)
        {
            var movies = Movie.GetByReleaseDate(startDate, endDate, offset, count);
            return Ok(movies ?? new List<Movie>());
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