using System;
using System.Collections.Generic;
using System.Linq;
using IMDBTask.Services;

namespace IMDBTask.Models
{
    public class RentedMovie
    {
        public int UserId { get; set; }
        public int MovieId { get; set; }
        public DateTime RentStart { get; set; }
        public DateTime RentEnd { get; set; }
        public float TotalPrice { get; set; }

        public RentedMovie() { }

        public RentedMovie(int userId, int movieId, DateTime rentStart, DateTime rentEnd, float totalPrice)
        {
            UserId = userId;
            MovieId = movieId;
            RentStart = rentStart;
            RentEnd = rentEnd;
            TotalPrice = totalPrice;
        }

        public int Insert()
        {
            DBservices dbs = new DBservices();
            return dbs.InsertRentedMovie(this);
        }

        public int Update(int userId, RentedMovie rentedMovie)
        {
            DBservices dbs = new DBservices();
            return dbs.UpdateRentedMovie(userId, rentedMovie);
        }

        public int Delete(int userId, int movieId)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteRentedMovie(userId, movieId);
        }
    }
}