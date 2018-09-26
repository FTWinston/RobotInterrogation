namespace RobotInterrogation.Models
{
    public class GameConfiguration
    {
        public int Duration { get; set; }
        public string[] Penalties { get; set; }
        public string[] SuspectNotes { get; set; }
        public Packet[] Packets { get; set; }
    }
}