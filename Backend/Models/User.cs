using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using IMDBTask.Services;

namespace IMDBTask.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }
        public bool isAdmin { get; set; }
        private static readonly PasswordHasher<User> _hasher = new PasswordHasher<User>();

        public User() { }

        public User(string name, string email, string password, bool active = true, bool admin = false)
        {
            Name = name;
            Email = email;
            Password = password;
            Active = active;
            isAdmin = admin;
        }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            this.Name = ToTitleCase(this.Name);
            this.Email = this.Email.ToLower();
            this.Password = _hasher.HashPassword(this, this.Password);
            //this.Active = true;
            //this.isAdmin = false;
            return dbs.InsertUser(this);
        }

        public static List<User> Read()
        {
            DBservices dbs = new DBservices();
            return dbs.GetAllUsers();
        }

        public User Update(int id)
        {
            DBservices dbs = new DBservices();
            this.Name = ToTitleCase(this.Name);
            this.Email = this.Email.ToLower();
            this.Password = _hasher.HashPassword(this, this.Password);

            int result = dbs.UpdateUser(this, id);
            return this;
        }

        public bool SetUserAttribute(string email, string attributeType)
        {
            DBservices dbs = new DBservices();
            var account = dbs.GetUserByEmail(email);
            if (account == null)
                return false;

            if (attributeType == "Admin")
                account.isAdmin = this.isAdmin;
            else if (attributeType == "Active")
                account.Active = this.Active;

            int result = dbs.UpdateUser(account, account.Id);
            return true;
        }

        public int Delete(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteUser(id);
        }

        public static User Login(string email, string password)
        {
            DBservices dbs = new DBservices();
            var account = dbs.GetUserByEmail(email);
            if (account == null)
                return null;

            var result = _hasher.VerifyHashedPassword(account, account.Password, password);
            return result == PasswordVerificationResult.Success ? account : null;
        }

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