namespace RobotInterrogation.Models
{
    public class PacketInfo
    {
        public string Name { get; set; }

        public string Difficulty { get; set; }

        public string Icon { get; set; }
    }

    public class Packet : PacketInfo
    {
        public string Prompt { get; set; }

        public Question[] Questions { get; set; }

        public SuspectRole[] Roles { get; set; }
    }
}