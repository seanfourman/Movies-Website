using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IMDBTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        /*
        // GET: api/<MovieController>
        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            return Movie.Read();
        }

        // Get by queryString
        [HttpGet("searchByTitle")]
        public IEnumerable<Movie> GetByTitle(string title)
        {
            return Movie.GetByTitle(title);
        }

        // Get by Routing
        [HttpGet("searchByReleaseDate/startDate/{startDate}/endDate/{endDate}")]
        public IEnumerable<Movie> GetByReleaseDate(DateTime startDate, DateTime endDate)
        {
            return Movie.GetByReleaseDate(startDate, endDate);
        }

        // DELETE api/<MovieController>/5
        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            return Movie.Delete(id);
        }
        */

        // POST api/<MovieController>
        [HttpPost]
        public int Post([FromBody] Movie movie)
        {
            return movie.Insert();
        }
    }
}
