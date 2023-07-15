namespace ColocviuDAW.Models
{
    public class Colectie
    {
        public int ColectieId { get; set; }
        public int UserId { get; set; }
        public int JocId { get; set; }
        public double Scor { get; set; }
        public string Stare { get; set; }
        public int NrOre { get; set; }
        public string Recenzie { get; set; }

        public int? VerJocSteam { get; set; }
        public int? VerNrOre { get; set; }
        public string? VerStare { get; set; }
    }
}
