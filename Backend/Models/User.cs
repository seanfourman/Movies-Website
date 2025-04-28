using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace IMDBTask.Models
{
    public class User
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }

        private static readonly PasswordHasher<User> _hasher = new PasswordHasher<User>();

        public User() { }

        public User(string name, string email, string password, bool active = true)
        {
            Name = name;
            Email = email;
            Password = password;
            Active = active;
        }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            this.Name = ToTitleCase(this.Name);
            this.Email = this.Email.ToLower();
            this.Password = _hasher.HashPassword(this, this.Password);
            this.Active = true;
            return dbs.Insert(this);
        }
        
        public int Update(User user, int id)
        {
            DBservices dbs = new DBservices();
            return dbs.Update(user, id);
        }
        
        public int Delete(User user, int id)
        {
            DBservices dbs = new DBservices();
            return dbs.Delete(user, id);
        }

        /*
        public bool Register()
        {
            this.Name = ToTitleCase(this.Name);
            this.Email = this.Email.ToLower();

            if (_usersList.Any(user => user.Email == this.Email))
                return false;

            this.Id = _nextId++;
            this.Password = _hasher.HashPassword(this, this.Password);
            this.Active = true;
            _usersList.Add(this);
            return true;
        }

        public static User? Login(string email, string password)
        {
            var user = _usersList.FirstOrDefault(u => u.Email.ToLower() == email.ToLower());
            if (user == null)
                return null;

            var result = _hasher.VerifyHashedPassword(user, user.Password, password);
            return result == PasswordVerificationResult.Success ? user : null;
        }
        */

        public static string ToTitleCase(string input)
        {
            string[] words = input.Split(' ').Where(w => !string.IsNullOrEmpty(w)).ToArray();
            for (int i = 0; i < words.Length; i++)
            {
                if (words[i].Length > 1)
                    words[i] = char.ToUpper(words[i][0]) + words[i].Substring(1).ToLower();
                else
                    words[i] = words[i].ToUpper();
            }

            return string.Join(' ', words);
        }
    }
}