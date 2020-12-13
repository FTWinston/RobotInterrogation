namespace RobotInterrogation.Models
{
    public class GameConfiguration
    {
        public int MaxPlayers { get; set; }
        public int Duration { get; set; }
        public string[] Penalties { get; set; }
        public string[] SuspectBackgrounds { get; set; }
        public Packet[] Packets { get; set; }
        public SuspectRole HumanRole { get; set; }
    }
}