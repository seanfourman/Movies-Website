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
        
        // POST api/Users/login/
        [HttpPost("login")]
        public ActionResult<UserDto> Login([FromBody] LoginModel credentials)
        {
            var user = Models.User.Login(credentials.Email, credentials.Password);
            if (user == null)
                return Unauthorized("Invalid email or password");

            if (user.Active == false)
                return Unauthorized("Inactive users are not allowed to login");
            return Ok(new UserDto(user));
        }

        // GET: api/<MoviesController>
        [HttpGet]
        public IEnumerable<User> Get()
        {
            return Models.User.Read();
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

        // PUT api/Users/setUserAttribute/{email}
        [HttpPut("setUserAttribute/{email}")]
        public ActionResult<bool> SetUserAttribute([FromBody] SetUserAttributeDto dto, string email)
        {
            User user = new User { isAdmin = dto.isAdmin, Active = dto.Active };

            bool success = user.SetUserAttribute(email.ToLower(), dto.AttributeType);

            if (!success)
            {
                return NotFound($"User with email {email} not found");
            }

            return Ok(true);
        }

        // DELETE api/Users/{id}
        [HttpDelete("{id}")]
        public int Delete(int id)
        {
            User user = new User();
            return user.Delete(id);
        }
    }

    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public bool Active { get; set; }
        public bool isAdmin { get; set; }

        public UserDto() { }

        public UserDto(User user)
        {
            Id = user.Id;
            Name = user.Name;
            Email = user.Email;
            Active = user.Active;
            isAdmin = user.isAdmin;
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class SetUserAttributeDto
    {
        public bool isAdmin { get; set; }
        public bool Active { get; set; }
        public string AttributeType { get; set; }
    }
}