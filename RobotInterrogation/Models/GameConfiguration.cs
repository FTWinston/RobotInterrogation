namespace RobotInterrogation.Models
{
    public class GameConfiguration
    {
        public string[] Penalties { get; set; }
        public string[] SuspectNotes { get; set; }
        public Packet[] Packets { get; set; }
    }
}