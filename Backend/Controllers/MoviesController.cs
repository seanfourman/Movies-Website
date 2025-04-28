using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

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
        
        // PUT api/Movies/update/{id}
        [HttpPut("{id}")]
        public int Put([FromBody] Movie movie, int id)
        {
            return movie.Update(movie, id);
        }
        
        // DELETE api/Movies/delete/{id}
        [HttpDelete("{id}")]
        public int Delete([FromBody] Movie movie, int id)
        {
            return movie.Delete(movie, id);
        }
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
    }
}
