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
                        Active = Convert.ToBoolean(reader["active"])
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
                    { "@active", user.Active }
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
                    { "@active", user.Active }
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

        public Movie GetMovieByTitle(string title)
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

                if (reader.Read())
                {
                    Movie movie = new Movie
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        Url = reader["url"].ToString(),
                        PrimaryTitle = reader["primaryTitle"].ToString(),
                        Description = reader["description"].ToString(),
                        PrimaryImage = reader["primaryImage"].ToString(),
                        Year = Convert.ToInt32(reader["year"]),
                        ReleaseDate = reader["releaseDate"] != DBNull.Value ?
                            Convert.ToDateTime(reader["releaseDate"]) : DateTime.MinValue,
                        Language = reader["language"].ToString(),
                        Budget = reader["budget"] != DBNull.Value ?
                            Convert.ToDouble(reader["budget"]) : 0,
                        GrossWorldwide = reader["grossWorldwide"] != DBNull.Value ?
                            Convert.ToDouble(reader["grossWorldwide"]) : 0,
                        Genres = reader["genres"].ToString(),
                        IsAdult = Convert.ToBoolean(reader["isAdult"]),
                        RuntimeMinutes = Convert.ToInt32(reader["runtimeMinutes"]),
                        AverageRating = reader["averageRating"] != DBNull.Value ?
                            Convert.ToSingle(reader["averageRating"]) : 0,
                        NumVotes = Convert.ToInt32(reader["numVotes"]),
                        PriceToRent = Convert.ToInt32(reader["priceToRent"]),
                        RentalCount = Convert.ToInt32(reader["rentalCount"])
                    };
                    return movie;
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