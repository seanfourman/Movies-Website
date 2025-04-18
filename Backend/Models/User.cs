﻿using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace IMDBTask.Models
{
    public class User
    {
        public int Id { get; private set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }

        private static readonly List<User> _usersList = new();
        private static int _nextId = 1;
        private static readonly PasswordHasher<User> _hasher = new PasswordHasher<User>();

        public User() { }

        public User(string name, string email, string password, bool active = true)
        {
            Name = name;
            Email = email;
            Password = password;
            Active = active;
        }

        public static List<User> Read()
        {
            return new List<User>(_usersList);
        }

        public bool Register()
        {
            this.Name = ToTitleCase(this.Name);
            this.Email = this.Email.ToLower();

            if (_usersList.Any(user => user.Email == this.Email))
                return false;

            this.Id = _nextId++;
            this.Password = _hasher.HashPassword(this, this.Password);
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