using ColocviuDAW.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JocController : ControllerBase
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public JocController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet]
        public JsonResult Get()
        {
            string cerere = @"select JocId, Nume, Scor from dbo.Jocuri";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(tabel);
        }

        [HttpGet("{id}")]
        public JsonResult GetJocId(int id)
        {
            string cerere = @"select * from dbo.Jocuri where JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@JocId", id);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(tabel);
        }

        [HttpPost]
        public JsonResult Post(Joc joc)
        {
            string cerere = @"insert into dbo.Jocuri values(@Nume, @Scor)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@Nume", joc.Nume);
                    comanda.Parameters.AddWithValue("@Scor", joc.Scor);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult("Adaugat joc succes");
        }

        [HttpPut]
        public JsonResult Put(Joc joc)
        {
            string cerere = @"update dbo.Jocuri set Nume = @Nume, Scor = @Scor where JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@JocId", joc.JocId);
                    comanda.Parameters.AddWithValue("@Nume", joc.Nume);
                    comanda.Parameters.AddWithValue("@Scor", joc.Scor);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult("Modificat joc succes");
        }

        [HttpDelete("{id}")]
        public JsonResult Delete(int id)
        {
            string cerere = @"delete from dbo.Jocuri where JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@JocId", id);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult("Sters joc succes");
        }

        [HttpGet("scorJoc/{jocId}")]
        public IActionResult GetScor(int jocId)
        {
            string cerere = @"select AVG(Scor) as MedieScor from dbo.Colectie where JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@JocId", jocId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(tabel);
        }

        [HttpPut("updateScor/{jocId}")]
        public IActionResult UpdateScor(int jocId)
        {
            string cerere = @"update dbo.Jocuri set Scor = (select AVG(Scor) from dbo.Colectie where JocId = @JocId) where JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@JocId", jocId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "scor update succes "  + jocId});
        }

        [HttpGet("getReviewsJoc/{jocId}")]
        public IActionResult GetReviewsJoc(int jocId)
        {
            string cerere = @"select col.ColectieId, usr.UserId, usr.Nume, col.Scor, col.Stare, col.NrOre, col.Recenzie, col.VerJocSteam, col.VerNrOre, col.VerStare from dbo.Colectie as col inner join dbo.Users as usr on col.UserId = usr.UserId where col.JocId = @JocId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@JocId", jocId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(tabel);
        }
    }
}
