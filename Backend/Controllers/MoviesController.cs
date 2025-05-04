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

        // GET: api/Movies/searchByTitle
        [HttpGet("searchByTitle")]
        public ActionResult<Movie> GetByTitle(string title)
        {
            var movie = Movie.GetByTitle(title);
            if (movie == null)
                return NotFound($"No movie found with title '{title}'");
            return Ok(movie);
        }

        /*
        // GET: api/<MovieController>
        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            return new List<Movie>();
        }

        // Get by Routing
        [HttpGet("searchByReleaseDate/startDate/{startDate}/endDate/{endDate}")]
        public IEnumerable<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate)
        {
            return new List<Movie>();
        }
        */
    }
}