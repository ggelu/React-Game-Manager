using System.Numerics;
using Microsoft.AspNetCore.Http;

namespace ColocviuDAW.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Nume { get; set; }
        public string Parola { get; set; }
        public string? SteamId { get; set; }
        public string NumeDisplay { get; set; }
        public string Email { get; set; }
        public IFormFile PozaUser { get; set; }
    }
}
