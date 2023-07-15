using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedalieController : Controller
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public MedalieController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet("getMedaliiUser")]
        public IActionResult GetMedaliiUser(int userId)
        {
            string cerere = @"select * from dbo.ColectieMedalii as col inner join dbo.Medalii as med on col.MedalieId = med.MedalieId where UserId = @UserId and col.Valoare is not null and col.Valoare != '0'";
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

            List<DataTable> listaAux = new List<DataTable>();
            listaAux.Add(tabel);
            return Ok(listaAux);
        }

        [HttpPut("getNrJocuri")]
        public IActionResult GetNrJocuri(int userId)
        {
            string cerere = @"update dbo.ColectieMedalii set Valoare = 
                (SELECT count(UserId) from dbo.Colectie where UserId = @UserId and Stare != 'Nejucat'), 
                DataObtinere = @DataObtinere where UserId = @UserId and MedalieId = 2";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@DataObtinere", DateTime.Now.ToShortDateString());
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new {message = "medalie jocuri succes"});
        }

        [HttpPut("getNrPrieteni")]
        public IActionResult GetNrPrieteni(int userId)
        {
            string cerere = @"update dbo.ColectieMedalii set Valoare = 
                   (SELECT count(UserId) from dbo.ListaPrieteni where UserId = @UserId),
                   DataObtinere = @DataObtinere where UserId = @UserId and MedalieId = 4";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@DataObtinere", DateTime.Now.ToShortDateString());
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new { message = "medalie prieteni succes" });
        }

        [HttpPut("getVechime")]
        public IActionResult GetVechime(int userId, string dataCont)
        {
            int nrAni = DateTime.Now.Year - DateTime.Parse(dataCont).Year;
            string valoareMedalie;
            if(nrAni < 1)
                valoareMedalie = "Mai putin de 1 an";
            else if(nrAni > 19)
                valoareMedalie = nrAni + " de ani";
            else
                valoareMedalie = nrAni + " ani";


            string cerere = @"update dbo.ColectieMedalii set Valoare = @Valoare, DataObtinere = @DataObtinere where UserId = @UserId and MedalieId = 3";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@Valoare", valoareMedalie);
                    comanda.Parameters.AddWithValue("@DataObtinere", DateTime.Now.ToShortDateString());
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new { message = "medalie ani succes" });
        }

        [HttpPut("getConectatSteam")]
        public IActionResult GetConectatSteam(int userId, string valoareMedalie)
        {
            string cerere = @"update dbo.ColectieMedalii set Valoare = @Valoare, DataObtinere = @DataObtinere where UserId = @UserId and MedalieId = 6";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@Valoare", valoareMedalie);
                    comanda.Parameters.AddWithValue("@DataObtinere", DateTime.Now.ToShortDateString());
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            return Ok(new { message = "medalie steam succes" });
        }

        [HttpDelete("deleteMedalii")]
        public IActionResult DeleteMedalii(int userId)
        {
            string cerere = @"delete from dbo.ColectieMedalii where UserId = @UserId";
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

            return Ok(new { message = "Stergere medalii succes" });
        }
    }
}
