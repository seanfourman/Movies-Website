using IMDBTask.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace IMDBTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // POST api/<UsersController>
        [HttpPost]
        public int Post([FromBody] User user)
        {
            return user.Insert();
        }

        // PUT api/Users/{id}
        [HttpPut("{id}")]
        public ActionResult<UserDto> Put([FromBody] User user, int id)
        {
            User updatedUser = user.Update(id);
            if (updatedUser == null)
            {
                return BadRequest("Failed to update user");
            }

            return Ok(new UserDto(updatedUser));
        }

        // DELETE api/Users/{id}
        [HttpDelete("{id}")]
        public int Delete(int id)
        {
            User user = new User();
            return user.Delete(id);
        }

        /*
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return new List<User>();
        }
        */

        [HttpPost("login")]
        public ActionResult<UserDto> Login([FromBody] LoginModel credentials)
        {
            var user = Models.User.Login(credentials.Email, credentials.Password);
            if (user == null)
                return Unauthorized("Invalid email or password");
            return Ok(new UserDto(user));
        }
    }

    public class CreateUserDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }

        public UserDto() { }

        public UserDto(User user)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
            Active = user.Active;
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}