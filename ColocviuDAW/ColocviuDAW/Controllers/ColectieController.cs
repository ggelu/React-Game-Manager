using ColocviuDAW.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api")]
    [ApiController]
    public class ColectieController : Controller
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public ColectieController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet("getColectii")]
        public IActionResult GetColectii()
        {
            string cerere = @"select * from dbo.Colectie";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(tabel);
        }

        [HttpGet("getUserColectie/{userId}")]
        public IActionResult GetUserColectie(int userId)
        {
            string cerere = @"select col.ColectieId, col.UserId, col.Stare, col.NrOre, gms.JocId, gms.Nume, gms.Scor from dbo.Colectie as col inner join dbo.Jocuri as gms on col.JocId = gms.JocId where col.UserId = @UserId and Stare != 'Nejucat'";
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

        [HttpGet("getUserWishlist/{userId}")]
        public IActionResult GetUserWishlist(int userId)
        {
            string cerere = @"select col.ColectieId, col.UserId, gms.JocId, gms.Nume, gms.Scor from dbo.Colectie as col inner join dbo.Jocuri as gms on col.JocId = gms.JocId where col.UserId = @UserId and Stare = 'Nejucat'";
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

        [HttpGet("checkColectie/{userId},{jocId}")]
        public IActionResult CheckColectie(int userId, int jocId)
        {
            string cerere = @"select * from dbo.Colectie where UserId = @UserId and JocId = @JocId and Stare != 'Nejucat'";
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

            if(tabel.Rows.Count < 1)
                return NoContent();
            return Ok(tabel);
        }

        [HttpGet("checkWishlist/{userId},{jocId}")]
        public IActionResult CheckWishlist(int userId, int jocId)
        {
            string cerere = @"select * from dbo.Colectie where UserId = @UserId and JocId = @JocId and Stare = 'Nejucat'";
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

        [HttpPost("addColectie")]
        public IActionResult AddColectie(Colectie col)
        {
            string cerere = @"insert into dbo.Colectie(UserId, JocId, Scor, Stare, NrOre, Recenzie) values(@UserId, @JocId, @Scor, @Stare, @NrOre, @Recenzie)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", col.UserId);
                    comanda.Parameters.AddWithValue("@JocId", col.JocId);
                    comanda.Parameters.AddWithValue("@Scor", col.Scor);
                    comanda.Parameters.AddWithValue("@Stare", col.Stare);
                    comanda.Parameters.AddWithValue("@NrOre", col.NrOre);
                    comanda.Parameters.AddWithValue("@Recenzie", col.Recenzie);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Adaugare colectie succes" });
        }

        [HttpPut("editColectie")]
        public IActionResult EditColectie(Colectie col)
        {
            string cerere = @"update dbo.Colectie set Scor = @Scor, Stare = @Stare, NrOre = @NrOre, Recenzie = @Recenzie where ColectieId = @ColectieId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@ColectieId", col.ColectieId);
                    comanda.Parameters.AddWithValue("@Scor", col.Scor);
                    comanda.Parameters.AddWithValue("@Stare", col.Stare);
                    comanda.Parameters.AddWithValue("@NrOre", col.NrOre);
                    comanda.Parameters.AddWithValue("@Recenzie", col.Recenzie);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Modificare colectie succes" });
        }

        [HttpDelete("deleteColectie")]
        public IActionResult DeleteColectie(int colectieId)
        {
            string cerere = @"delete from dbo.Colectie where ColectieId = @ColectieId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@ColectieId", colectieId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Stergere colectie succes" });
        }

        [HttpDelete("deleteUserColectie")]
        public IActionResult DeleteUserColectie(int userId)
        {
            string cerere = @"delete from dbo.Colectie where UserId = @UserId";
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

            return Ok(new { message = "Stergere colectie user succes" });
        }

        [HttpPut("verJocUserSteam")]
        public IActionResult VerJocUserSteam(int verVal)
        {
            string cerere = @"update dbo.Colectie set VerJocSteam = @VerJocSteam where ColectieId = @ColectieId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@VerJocSteam", verVal);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Modificare colectie succes" });
        }

        [HttpPut("verNrOreSteam")]
        public IActionResult VerNrOreSteam(int verVal)
        {
            string cerere = @"update dbo.Colectie set VerNrOre = @VerNrOre where ColectieId = @ColectieId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@VerNrOre", verVal);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Modificare colectie succes" });
        }

        [HttpPut("verStareSteam")]
        public IActionResult VerStareSteam(string verVal)
        {
            string cerere = @"update dbo.Colectie set VerStare = @VerStare where ColectieId = @ColectieId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@VerStare", verVal);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Modificare colectie succes" });
        }
    }
}
