using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using IMDBTask.Models;

public class DBservices
{
    public DBservices() { }

    public SqlConnection connect(String conString)
    {
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("moviesDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    public int Insert<T>(T entity)
    {
        SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("moviesDB");
        }
        catch (Exception ex)
        {
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        string storedProcedureName = "";

        if (entity is Movie movie)
        {
            paramDic.Add("@url", movie.Url);
            paramDic.Add("@primaryTitle", movie.PrimaryTitle);
            paramDic.Add("@description", movie.Description);
            paramDic.Add("@primaryImage", movie.PrimaryImage);
            paramDic.Add("@year", movie.Year);
            paramDic.Add("@releaseDate", movie.ReleaseDate);
            paramDic.Add("@language", movie.Language);
            paramDic.Add("@budget", movie.Budget);
            paramDic.Add("@grossWorldwide", movie.GrossWorldwide);
            paramDic.Add("@genres", movie.Genres);
            paramDic.Add("@isAdult", movie.IsAdult);
            paramDic.Add("@runtimeMinutes", movie.RuntimeMinutes);
            paramDic.Add("@averageRating", movie.AverageRating);
            paramDic.Add("@numVotes", movie.NumVotes);
            paramDic.Add("@priceToRent", GenerateRandomPrice());
            paramDic.Add("@rentalCount", movie.RentalCount);
            storedProcedureName = "SP_InsertMovie";
        }

        if (entity is User user)
        {
            paramDic.Add("@name", user.Name);
            paramDic.Add("@email", user.Email);
            paramDic.Add("@password", user.Password);
            paramDic.Add("@active", user.Active);
            storedProcedureName = "SP_InsertUser";
        }
        cmd = CreateCommandWithStoredProcedureGeneral(storedProcedureName, con, paramDic);

        try
        {
            int numEffected = cmd.ExecuteNonQuery();
            return numEffected;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    public int Update<T>(T entity, int id)
    {
        SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("moviesDB");
        }
        catch (Exception ex)
        {
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        string storedProcedureName = "";
        if (entity is Movie movie)
        {
            paramDic.Add("@id", id);
            paramDic.Add("@url", movie.Url);
            paramDic.Add("@primaryTitle", movie.PrimaryTitle);
            paramDic.Add("@description", movie.Description);
            paramDic.Add("@primaryImage", movie.PrimaryImage);
            paramDic.Add("@year", movie.Year);
            paramDic.Add("@releaseDate", movie.ReleaseDate);
            paramDic.Add("@language", movie.Language);
            paramDic.Add("@budget", movie.Budget);
            paramDic.Add("@grossWorldwide", movie.GrossWorldwide);
            paramDic.Add("@genres", movie.Genres);
            paramDic.Add("@isAdult", movie.IsAdult);
            paramDic.Add("@runtimeMinutes", movie.RuntimeMinutes);
            paramDic.Add("@averageRating", movie.AverageRating);
            paramDic.Add("@numVotes", movie.NumVotes);
            paramDic.Add("@priceToRent", movie.PriceToRent);
            paramDic.Add("@rentalCount", movie.RentalCount);
            storedProcedureName = "SP_UpdateMovie";
        }

        if (entity is User user)
        {
            paramDic.Add("@id", id);
            paramDic.Add("@name", user.Name);
            paramDic.Add("@email", user.Email);
            paramDic.Add("@password", user.Password);
            paramDic.Add("@active", user.Active);
            storedProcedureName = "SP_UpdateUser";
        }
        cmd = CreateCommandWithStoredProcedureGeneral(storedProcedureName, con, paramDic);

        try
        {
            int numEffected = cmd.ExecuteNonQuery();
            return numEffected;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }
    
    public int Delete<T>(T entity, int id)
    {
        SqlConnection con;
        SqlCommand cmd;
        try
        {
            con = connect("moviesDB");
        }
        catch (Exception ex)
        {
            throw (ex);
        }

        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        string storedProcedureName = "";
        if (entity is Movie movie)
        {
            paramDic.Add("@id", id);
            storedProcedureName = "SP_DeleteMovie";
        }

        if (entity is User user)
        {
            paramDic.Add("@id", id);
            storedProcedureName = "SP_DeleteUser";
        }
        cmd = CreateCommandWithStoredProcedureGeneral(storedProcedureName, con, paramDic);

        try
        {
            int numEffected = cmd.ExecuteNonQuery();
            return numEffected;
        }
        catch (Exception ex)
        {
            throw (ex);
        }
        finally
        {
            if (con != null)
            {
                con.Close();
            }
        }
    }

    private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
    {
        SqlCommand cmd = new SqlCommand();                         // create the command object
        cmd.Connection = con;                                      // assign the connection to the command object
        cmd.CommandText = spName;                                  // can be Select, Insert, Update, Delete 
        cmd.CommandTimeout = 10;                                   // Time to wait for the execution The default is 30 seconds
        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text
        if (paramDic != null)
            foreach (KeyValuePair<string, object> param in paramDic)
            {
                cmd.Parameters.AddWithValue(param.Key, param.Value);

            }
        return cmd;
    }

    public int GenerateRandomPrice()
    {
        Random random = new Random();
        return random.Next(10, 31);
    }
}
