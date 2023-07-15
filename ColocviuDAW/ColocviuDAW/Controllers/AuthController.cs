using ColocviuDAW.Dtos;
using ColocviuDAW.Helpers;
using ColocviuDAW.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;

namespace ColocviuDAW.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IConfiguration _config;
        private readonly Jwt _jwt;
        private string conexiune;

        public AuthController(IConfiguration config, Jwt jwt)
        {
            _config = config;
            conexiune = _config.GetConnectionString("DAWAppCon");
            _jwt = jwt;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm]RegisterDto dto)
        {
            var User = new User
            {
                Nume = dto.Nume,
                Parola = BCrypt.Net.BCrypt.HashPassword(dto.Parola),
                NumeDisplay = dto.NumeDisplay,
                Email = dto.Email,
                PozaUser = dto.PozaUser
            };

            string numePoza = Path.Combine("F:\\DAW\\Test2\\colocviu-react\\public\\images\\Users", dto.PozaUser.FileName);
            using (var stream = new FileStream(numePoza, FileMode.Create))
            {
                dto.PozaUser.CopyTo(stream);
            }

            numePoza = dto.PozaUser.FileName;

            string cerere = @"insert into dbo.Users(Nume, Parola, NumeDisplay, Email, PozaUser, DataCont) output inserted.UserId values(@Nume, @Parola, @NumeDisplay, @Email, @PozaUser, @DataCont)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(conexiune))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@Nume", User.Nume);
                    comanda.Parameters.AddWithValue("@Parola", User.Parola);
                    comanda.Parameters.AddWithValue("@NumeDisplay", User.NumeDisplay);
                    comanda.Parameters.AddWithValue("@Email", User.Email);
                    comanda.Parameters.AddWithValue("@PozaUser", numePoza);
                    comanda.Parameters.AddWithValue("@DataCont", DateTime.Now.ToShortDateString());

                    try
                    {
                        reader = comanda.ExecuteReader();
                        tabel.Load(reader);
                    }
                    catch(SqlException ex)
                    {
                        return BadRequest(ex.Message);
                    }
                }
            }

            int userId = int.Parse(tabel.Rows[0][0].ToString());

            SetMedalii(userId);

            return Ok(new {message = "User creat succes"});
            //return Ok(tabel.Rows[0]["UserId"]);
        }

        [HttpPost]
        public void SetMedalii(int userId)
        {
            string cerere = @"insert into dbo.ColectieMedalii(UserId, MedalieId) values(@UserId, 2), (@UserId, 3), (@UserId, 4), (@UserId, 6)";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(conexiune))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@UserId", userId);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            string cerere = @"select UserId, Nume, Parola from dbo.Users where Nume = @Nume";
            DataTable tabel = new DataTable();
            SqlDataReader reader;
            using (SqlConnection con = new SqlConnection(conexiune))
            {
                con.Open();
                using (SqlCommand comanda = new SqlCommand(cerere, con))
                {
                    comanda.Parameters.AddWithValue("@Nume", dto.Nume);
                    reader = comanda.ExecuteReader();
                    tabel.Load(reader);
                }
            }

            if (tabel.Rows.Count <= 0)        
                return BadRequest(error:new {message = "Date Invalide"});
            else if(!BCrypt.Net.BCrypt.Verify(dto.Parola, tabel.Rows[0]["Parola"].ToString()))
                return BadRequest(error: new { message = "Date Invalide" });

            var jwt = _jwt.Genereaza((int)tabel.Rows[0]["UserId"]);

            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true
            });

            return Ok(new {message = "succes"});
        }

        [HttpGet("userAuth")]
        public IActionResult User()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                var token = _jwt.Verifica(jwt);

                int userId = int.Parse(token.Issuer);

                string cerere = @"select UserId, Nume, SteamId from dbo.Users where UserId = @UserId";
                DataTable tabel = new DataTable();
                SqlDataReader reader;
                using (SqlConnection con = new SqlConnection(conexiune))
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
            }catch(Exception _)
            {
                return Unauthorized();
            }   
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new { message = "succes" });
        }
    }
}
