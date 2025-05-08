using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using IMDBTask.Models;
using Microsoft.Extensions.Configuration;

namespace IMDBTask.Services
{
    public class DBservices
    {
        private readonly string _connectionString;

        public DBservices()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json").Build();
            _connectionString = configuration.GetConnectionString("moviesDB");
        }

        private SqlConnection Connect()
        {
            SqlConnection con = new SqlConnection(_connectionString);
            con.Open();
            return con;
        }

        public List<User> GetAllUsers()
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                cmd = CreateCommandWithStoredProcedure("SP_GetAllUsers", con, null);

                SqlDataReader reader = cmd.ExecuteReader();
                List<User> users = new List<User>();

                while (reader.Read())
                {
                    User user = new User
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Name = reader["name"].ToString(),
                        Email = reader["email"].ToString(),
                        Password = reader["password"].ToString(),
                        Active = Convert.ToBoolean(reader["active"]),
                        isAdmin = Convert.ToBoolean(reader["admin"])
                    };

                    users.Add(user);
                }

                return users;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public User GetUserByEmail(string email)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@email", email }
                };

                cmd = CreateCommandWithStoredProcedure("SP_SelectUser", con, parameters);
                SqlDataReader reader = cmd.ExecuteReader();

                if (reader.Read())
                {
                    User user = new User
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Name = reader["name"].ToString(),
                        Email = reader["email"].ToString(),
                        Password = reader["password"].ToString(),
                        Active = Convert.ToBoolean(reader["active"]),
                        isAdmin = Convert.ToBoolean(reader["admin"])
                    };
                    return user;
                }
                return null;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public int InsertUser(User user)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@name", user.Name },
                    { "@email", user.Email },
                    { "@password", user.Password },
                    { "@active", user.Active },
                    { "@admin", user.isAdmin }
                };

                cmd = CreateCommandWithStoredProcedure("SP_InsertUser", con, parameters);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        
        public int UpdateUser(User user, int id)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@id", id },
                    { "@name", user.Name },
                    { "@email", user.Email },
                    { "@password", user.Password },
                    { "@active", user.Active },
                    { "@admin", user.isAdmin }
                };

                cmd = CreateCommandWithStoredProcedure("SP_UpdateUser", con, parameters);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public int DeleteUser(int id)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@id", id }
                };

                cmd = CreateCommandWithStoredProcedure("SP_DeleteUser", con, parameters);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<Movie> GetAllMovies()
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                cmd = CreateCommandWithStoredProcedure("SP_GetAllMovies", con, null);
                SqlDataReader reader = cmd.ExecuteReader();
                List<Movie> movies = new List<Movie>();

                while (reader.Read())
                {
                    Movie movie = new Movie
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        PrimaryTitle = reader["primaryTitle"].ToString(),
                        Description = reader["description"].ToString(),
                        Url = reader["url"].ToString(),
                        PrimaryImage = reader["primaryImage"].ToString(),
                        Year = Convert.ToInt32(reader["year"]),
                        ReleaseDate = Convert.ToDateTime(reader["releaseDate"]),
                        Language = reader["language"].ToString(),
                        Budget = Convert.ToDouble(reader["budget"]),
                        GrossWorldwide = Convert.ToDouble(reader["grossWorldwide"]),
                        Genres = reader["genres"].ToString(),
                        IsAdult = Convert.ToBoolean(reader["isAdult"]),
                        RuntimeMinutes = Convert.ToInt32(reader["runtimeMinutes"]),
                        AverageRating = (float)Convert.ToDouble(reader["averageRating"]),
                        NumVotes = Convert.ToInt32(reader["numVotes"])
                    };

                    movies.Add(movie);
                }

                return movies;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<Movie> GetMovieByTitle(string title)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
        {
            { "@primaryTitle", title }
        };

                cmd = CreateCommandWithStoredProcedure("SP_GetMovieByTitle", con, parameters);
                SqlDataReader reader = cmd.ExecuteReader();
                List<Movie> movies = new List<Movie>();

                while (reader.Read())
                {
                    Movie movie = new Movie
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Url = reader["url"].ToString(),
                        PrimaryTitle = reader["primaryTitle"].ToString(),
                        Description = reader["description"].ToString(),
                        PrimaryImage = reader["primaryImage"].ToString(),
                        Year = Convert.ToInt32(reader["year"]),
                        ReleaseDate = Convert.ToDateTime(reader["releaseDate"]),
                        Language = reader["language"].ToString(),
                        Budget = Convert.ToDouble(reader["budget"]),
                        GrossWorldwide = Convert.ToDouble(reader["grossWorldwide"]),
                        Genres = reader["genres"].ToString(),
                        IsAdult = Convert.ToBoolean(reader["isAdult"]),
                        RuntimeMinutes = Convert.ToInt32(reader["runtimeMinutes"]),
                        AverageRating = (float)Convert.ToDouble(reader["averageRating"]),
                        NumVotes = Convert.ToInt32(reader["numVotes"]),
                        PriceToRent = Convert.ToInt32(reader["priceToRent"]),
                        RentalCount = Convert.ToInt32(reader["rentalCount"])
                    };
                    movies.Add(movie);
                }
                return movies;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<Movie> GetMovieByReleaseDate(DateTime startDate, DateTime endDate)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@startDate", startDate },
                    { "@endDate", endDate }
                };

                cmd = CreateCommandWithStoredProcedure("SP_GetMovieByReleaseDate", con, parameters);
                SqlDataReader reader = cmd.ExecuteReader();
                List<Movie> movies = new List<Movie>();

                while (reader.Read())
                {
                    Movie movie = new Movie
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Url = reader["url"].ToString(),
                        PrimaryTitle = reader["primaryTitle"].ToString(),
                        Description = reader["description"].ToString(),
                        PrimaryImage = reader["primaryImage"].ToString(),
                        Year = Convert.ToInt32(reader["year"]),
                        ReleaseDate = Convert.ToDateTime(reader["releaseDate"]),
                        Language = reader["language"].ToString(),
                        Budget = Convert.ToDouble(reader["budget"]),
                        GrossWorldwide = Convert.ToDouble(reader["grossWorldwide"]),
                        Genres = reader["genres"].ToString(),
                        IsAdult = Convert.ToBoolean(reader["isAdult"]),
                        RuntimeMinutes = Convert.ToInt32(reader["runtimeMinutes"]),
                        AverageRating = (float)Convert.ToDouble(reader["averageRating"]),
                        NumVotes = Convert.ToInt32(reader["numVotes"]),
                        PriceToRent = Convert.ToInt32(reader["priceToRent"]),
                        RentalCount = Convert.ToInt32(reader["rentalCount"])
                    };
                    movies.Add(movie);
                }
                return movies;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public int InsertMovie(Movie movie)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@url", movie.Url },
                    { "@primaryTitle", movie.PrimaryTitle },
                    { "@description", movie.Description },
                    { "@primaryImage", movie.PrimaryImage },
                    { "@year", movie.Year },
                    { "@releaseDate", movie.ReleaseDate },
                    { "@language", movie.Language },
                    { "@budget", movie.Budget },
                    { "@grossWorldwide", movie.GrossWorldwide },
                    { "@genres", movie.Genres },
                    { "@isAdult", movie.IsAdult },
                    { "@runtimeMinutes", movie.RuntimeMinutes },
                    { "@averageRating", movie.AverageRating },
                    { "@numVotes", movie.NumVotes },
                    { "@priceToRent", GenerateRandomPrice() },
                    { "@rentalCount", movie.RentalCount }
                };

                cmd = CreateCommandWithStoredProcedure("SP_InsertMovie", con, parameters);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public int UpdateMovie(Movie movie, int id)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@id", id },
                    { "@url", movie.Url },
                    { "@primaryTitle", movie.PrimaryTitle },
                    { "@description", movie.Description },
                    { "@primaryImage", movie.PrimaryImage },
                    { "@year", movie.Year },
                    { "@releaseDate", movie.ReleaseDate },
                    { "@language", movie.Language },
                    { "@budget", movie.Budget },
                    { "@grossWorldwide", movie.GrossWorldwide },
                    { "@genres", movie.Genres },
                    { "@isAdult", movie.IsAdult },
                    { "@runtimeMinutes", movie.RuntimeMinutes },
                    { "@averageRating", movie.AverageRating },
                    { "@numVotes", movie.NumVotes },
                    { "@priceToRent", movie.PriceToRent },
                    { "@rentalCount", movie.RentalCount }
                };

                cmd = CreateCommandWithStoredProcedure("SP_UpdateMovie", con, parameters);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public int DeleteMovie(int id)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
                {
                    { "@id", id }
                };

                cmd = CreateCommandWithStoredProcedure("SP_DeleteMovie", con, parameters);
                return cmd.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        public List<Movie> GetRentedMovies(int id)
        {
            SqlConnection con = null;
            SqlCommand cmd;

            try
            {
                con = Connect();
                Dictionary<string, object> parameters = new Dictionary<string, object>
        {
            { "@userId", id }
        };

                cmd = CreateCommandWithStoredProcedure("SP_GetRentedMovies", con, parameters);
                SqlDataReader reader = cmd.ExecuteReader();
                List<Movie> movies = new List<Movie>();

                while (reader.Read())
                {
                    Movie movie = new Movie
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Url = reader["url"].ToString(),
                        PrimaryTitle = reader["primaryTitle"].ToString(),
                        Description = reader["description"].ToString(),
                        PrimaryImage = reader["primaryImage"].ToString(),
                        Year = Convert.ToInt32(reader["year"]),
                        ReleaseDate = Convert.ToDateTime(reader["releaseDate"]),
                        Language = reader["language"].ToString(),
                        Budget = Convert.ToDouble(reader["budget"]),
                        GrossWorldwide = Convert.ToDouble(reader["grossWorldwide"]),
                        Genres = reader["genres"].ToString(),
                        IsAdult = Convert.ToBoolean(reader["isAdult"]),
                        RuntimeMinutes = Convert.ToInt32(reader["runtimeMinutes"]),
                        AverageRating = (float)Convert.ToDouble(reader["averageRating"]),
                        NumVotes = Convert.ToInt32(reader["numVotes"])
                        //RentIsFinished = Convert.ToInt32(reader["rentIsFinished"])
                    };
                    movies.Add(movie);
                }

                return movies;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }

        private SqlCommand CreateCommandWithStoredProcedure(string spName, SqlConnection con, Dictionary<string, object> parameters)
        {
            SqlCommand cmd = new SqlCommand
            {
                Connection = con,
                CommandText = spName,
                CommandTimeout = 10,
                CommandType = CommandType.StoredProcedure
            };

            if (parameters != null)
            {
                foreach (KeyValuePair<string, object> param in parameters)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);
                }
            }

            return cmd;
        }

        private int GenerateRandomPrice()
        {
            Random random = new Random();
            return random.Next(10, 31);
        }
    }
}