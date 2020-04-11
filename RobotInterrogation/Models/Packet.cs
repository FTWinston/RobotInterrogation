namespace RobotInterrogation.Models
{
    public class Packet
    {
        public string Description { get; set; }
        public string Prompt { get; set; }
        public Question[] Questions { get; set; }

        public SuspectRole[] Roles { get; set; }
    }
}