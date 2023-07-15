using ColocviuDAW.Dtos;
using ColocviuDAW.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private string sqlDataSource;

        public UserController(IConfiguration config)
        {
            _config = config;
            sqlDataSource = _config.GetConnectionString("DAWAppCon");
        }

        [HttpGet]
        public JsonResult Get()
        {
            string cerere = @"select * from dbo.Users";
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

        [HttpGet("getUser/{id}")]
        public JsonResult GetUser(int id)
        {
            string cerere = @"select * from dbo.Users where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", id);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(tabel);
        }

        [HttpGet("verNumeMailDisplay")]
        public JsonResult VerNumeMailDisplay(string nume, string numeDisplay, string email)
        {
            string cerere = @"select Nume, NumeDisplay, Email from dbo.Users where Nume = @Nume or NumeDisplay = @NumeDisplay or Email = @Email";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@Nume", nume);
                    comanda.Parameters.AddWithValue("@NumeDisplay", numeDisplay);
                    comanda.Parameters.AddWithValue("@Email", email);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(tabel);
        }

        [HttpGet("getUserEdit")]
        public IActionResult GetUserEdit(int id)
        {
            string cerere = @"select * from dbo.Users where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", id);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(tabel);
        }

        [HttpGet("{nume},{parola}")]
        public JsonResult GetUserId(string nume, string parola)
        {
            string cerere = @"select UserId from dbo.Users where Nume = @Nume and Parola = @Parola";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@Nume", nume);
                    comanda.Parameters.AddWithValue("@Parola", parola);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult(tabel);
        }

        [HttpPost]
        public JsonResult Post(User user)
        {
            string cerere = @"insert into dbo.Users values(@Nume, @Parola)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@Nume", user.Nume);
                    comanda.Parameters.AddWithValue("@Parola", user.Parola);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return new JsonResult("Adaugat cu succes");
        }

        [HttpPut("editProfil")]
        public IActionResult Put([FromForm]User user)
        {
            string numePoza = Path.Combine("F:\\DAW\\Test2\\colocviu-react\\public\\images\\Users", user.PozaUser.FileName);
            using(var stream = new FileStream(numePoza, FileMode.Create))
            {
                user.PozaUser.CopyTo(stream);
            }

            numePoza = user.PozaUser.FileName;

            user.Parola = BCrypt.Net.BCrypt.HashPassword(user.Parola);

            string cerere = @"update dbo.Users set Nume = @Nume, Parola = @Parola, NumeDisplay = @NumeDisplay, Email = @Email, PozaUser = @PozaUser where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", user.UserId);
                    comanda.Parameters.AddWithValue("@Nume", user.Nume);
                    comanda.Parameters.AddWithValue("@Parola", user.Parola);
                    comanda.Parameters.AddWithValue("@NumeDisplay", user.NumeDisplay);
                    comanda.Parameters.AddWithValue("@Email", user.Email);
                    comanda.Parameters.AddWithValue("@PozaUser", numePoza);

                    try
                    {
                        reader = comanda.ExecuteReader();
                        tabel.Load(reader);
                    }
                    catch (SqlException ex)
                    {
                        return BadRequest(ex.Message);
                    }

                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Modificat cu succes" });
        }

        [HttpPut("setSteamId")]
        public IActionResult SetSteamId(string userId, string steamId)
        {
            string cerere = @"update dbo.Users set SteamId = @SteamId where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    comanda.Parameters.AddWithValue("@SteamId", steamId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Updated successfully" });
        }

        [HttpPut("deconecteazaSteam")]
        public IActionResult DeconecteazaSteam(int userId)
        {
            string cerere = @"update dbo.Users set SteamId = null where UserId = @UserId";
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
            return Ok(new { message = "deconectare steam succes" });
        }

        [HttpDelete("deleteProfil")]
        public IActionResult DeleteProfil(int id)
        {
            string cerere = @"delete from dbo.Users where UserId = @UserId";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(sqlDataSource))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", id);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                    reader.Close();
                    con.Close();
                }
            }

            return Ok(new { message = "Sters user " + id });
        }
    }
}
