using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using System.Data;
using ColocviuDAW.Models;

namespace ColocviuDAW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IstoricController : ControllerBase
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public IstoricController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet("getIstoric")]
        public IActionResult GetIstoric(int userId)
        {
            string cerere = @"select * from dbo.Istoric where UserId = @UserId";
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

            return Ok(tabel);
        }

        [HttpPost("addIstoric")]
        public IActionResult AddIstoric(Istoric istoric)
        {
            string cerere = @"insert into dbo.Istoric(UserId, Descriere, DataActiune) values(@UserId, @Descriere, @DataActiune)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", istoric.UserId);
                    comanda.Parameters.AddWithValue("@Descriere", istoric.Descriere);
                    comanda.Parameters.AddWithValue("@DataActiune", DateTime.Now.ToShortDateString());
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "istoric adaugat cu succes" });
        }

        [HttpDelete("stergeIstoric")]
        public IActionResult StergeIstoric(int userId)
        {
            string cerere = @"delete from dbo.Istoric where UserId = @UserId";
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

            return Ok(new { message = "istoric sters succes" });
        }
    }
}
