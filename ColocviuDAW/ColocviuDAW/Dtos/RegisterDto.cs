namespace ColocviuDAW.Dtos
{
    public class RegisterDto
    {
        public string Nume { get; set; }
        public string Parola { get; set; }
        public string NumeDisplay { get; set; }
        public string Email { get; set; }
        public IFormFile PozaUser { get; set; }
    }
}
