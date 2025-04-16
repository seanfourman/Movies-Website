using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace IMDBTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return Models.User.Read();
        }

        // POST api/<UsersController>
        [HttpPost]
        public bool Post([FromBody] User user)
        {
            return user.Register();
        }
    }
}
