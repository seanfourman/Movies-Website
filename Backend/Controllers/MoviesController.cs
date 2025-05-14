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

        // DELETE: api/Movies/reset-database
        [HttpDelete("reset-database")]
        public ActionResult<bool> ResetMovieDatabase()
        {
            try
            {
                bool result = Movie.ResetMovieDatabase();
                if (result)
                {
                    return Ok(true);
                }
                else
                {
                    return StatusCode(500, "Failed to reset movie database");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error resetting movie database: {ex.Message}");
            }
        }
    }
}