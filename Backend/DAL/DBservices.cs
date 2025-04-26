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
    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the appsettings.json 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {
        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("moviesDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    //--------------------------------------------------------------------------------------------------
    // This method inserts a movie into the movies table 
    //--------------------------------------------------------------------------------------------------
    public int Insert<T>(T entity)
    {
        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("moviesDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
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

        cmd = CreateCommandWithStoredProcedureGeneral(storedProcedureName, con, paramDic); // create the command

        try
        {
            int numEffected = cmd.ExecuteNonQuery(); // execute the command -> return the number of affected rows
            return numEffected;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }


    //---------------------------------------------------------------------------------
    // Create the SqlCommand
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

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


    //--------------------------------------------------------------------
    // TODO Build the Flight Delete  method
    // DeleteFlight(int id)
    //--------------------------------------------------------------------

}
