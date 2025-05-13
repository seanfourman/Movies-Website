using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using IMDBTask.Services;

namespace IMDBTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RentedMoviesController : ControllerBase
    {
        // POST api/RentedMovies
        [HttpPost]
        public int Post([FromBody] RentedMovie rentedMovie)
        {
            return rentedMovie.Insert();
        }

        // GET: api/RentedMovies
        [HttpGet("getRentedMoviesById/{id}")]
        public IEnumerable<Movie> Get(int id)
        {
            return Movie.GetRentedMoviesById(id);
        }

        // PUT: api/RentedMovie/{id}
        [HttpPut("{userId}")]
        public int Put([FromBody] RentedMovie rentedMovie, int userId)
        {
            return rentedMovie.Update(userId, rentedMovie);
        }

        // DELETE api/RentedMovies/userId/{userId}/movieId/{movieId}
        [HttpDelete("userId/{userId}/movieId/{movieId}")]
        public int Delete(int userId, int movieId)
        {
            RentedMovie rentedMovie = new RentedMovie();
            return rentedMovie.Delete(userId, movieId);
        }
    }
}