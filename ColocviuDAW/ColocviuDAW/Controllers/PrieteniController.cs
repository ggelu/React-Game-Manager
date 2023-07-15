using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrieteniController : Controller
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public PrieteniController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet("getPrieteni")]
        public IActionResult GetPrieteni(int userId)
        {
            string cerere = @"select pr.UserId, pr.PrietenId, usr.NumeDisplay from dbo.ListaPrieteni as pr join dbo.Users as usr on pr.PrietenId = usr.UserId where pr.UserId = @UserId";
            DataTable tabel = new DataTable();
            DataTable tabel2 = new DataTable();
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

                cerere = @"select pr.UserId, pr.PrietenId, usr.NumeDisplay from dbo.ListaPrieteni as pr join dbo.Users as usr on pr.UserId = usr.UserId where pr.UserId = @UserId";
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    reader = comanda.ExecuteReader();
                    tabel2.Load(reader);
                }
            }

            tabel.Merge(tabel2);
            return Ok(tabel);
        }

        [HttpGet("verificaPrieten")]
        public IActionResult VerificaPrieten(int userId, int prietenId)
        {
            string cerere = @"select UserId, PrietenId from dbo.ListaPrieteni where UserId = @UserId and PrietenId = @PrietenId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@PrietenId", prietenId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(tabel);
        }

        [HttpPost("adaugaPrieten")]
        public IActionResult AdaugaPrieten(int userId, int prietenId)
        {
            string cerere = @"insert dbo.ListaPrieteni values(@UserId, @PrietenId)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@PrietenId", prietenId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new { message = "prieten adaugat cu succes" });
        }

        [HttpDelete("stergePrieten")]
        public IActionResult StergePrieten(int userId, int prietenId)
        {
            string cerere = @"delete from dbo.ListaPrieteni where UserId = @UserId and PrietenId = @PrietenId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@PrietenId", prietenId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new { message = "prieten sters succes" });
        }

        [HttpDelete("stergeListaPrieteni")]
        public IActionResult StergeListaPrieteni(int userId)
        {
            string cerere = @"delete from dbo.ListaPrieteni where UserId = @UserId or PrietenId = @UserId";
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

            return Ok(new { message = "lista prieteni sters succes" });
        }
    }
}
