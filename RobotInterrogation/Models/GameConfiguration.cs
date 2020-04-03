namespace RobotInterrogation.Models
{
    public class GameConfiguration
    {
        public int Duration { get; set; }
        public string[] Penalties { get; set; }
        public string[] SuspectBackgrounds { get; set; }
        public Packet[] Packets { get; set; }
    }
}