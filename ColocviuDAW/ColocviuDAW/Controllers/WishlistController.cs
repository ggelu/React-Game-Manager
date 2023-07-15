using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : Controller
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public WishlistController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet("getUserWishlist/{userId}")]
        public IActionResult GetUserWishlist(int userId)
        {
            string cerere = @"select wl.WishlistId, wl.UserId, gms.JocId, gms.Nume, gms.Scor from dbo.Wishlist as wl inner join dbo.Jocuri as gms on wl.JocId = gms.JocId where wl.UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(tabel);
        }

        [HttpGet("checkWishlist/{userId},{jocId}")]
        public IActionResult CheckWishlist(int userId, int jocId)
        {
            string cerere = @"select * from dbo.Wishlist where UserId = @UserId and JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@JocId", jocId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            if (tabel.Rows.Count < 1)
                return NoContent();
            return Ok(tabel);
        }

        [HttpPost("adaugaWishlistEntry")]
        public IActionResult AdaugaWishlistEntry(int userId, int jocId)
        {
            string cerere = @"insert dbo.Wishlist(UserId, JocId) values(@UserId, @JocId)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@JocId", jocId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new { message = "adaugare wishlist succes" });
        }

        [HttpDelete("deleteWishlistEntry")]
        public IActionResult DeleteWishlistEntry(int userId, int jocId)
        {
            string cerere = @"delete from dbo.Wishlist where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@JocId", jocId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Stergere wishlist entry succes" });
        }

        [HttpDelete("deleteWishlistUser")]
        public IActionResult DeleteWishlistUser(int userId)
        {
            string cerere = @"delete from dbo.Wishlist where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Stergere wishlist succes" });
        }
    }
}
