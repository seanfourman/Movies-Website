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

        [HttpPost("login")]
        public ActionResult<UserDto> Login([FromBody] LoginModel credentials)
        {
            var user = Models.User.Login(credentials.Email, credentials.Password);
            if (user == null)
                return Unauthorized("Invalid email or password");

            return Ok(new UserDto(user));
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }

        // copy constructor
        public UserDto(User user)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
            Active = user.Active;
        }
    }
}
