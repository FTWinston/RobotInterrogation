namespace RobotInterrogation.Models
{
    public class Packet
    {
        public string Description { get; set; }
        public string Prompt { get; set; }
        public Question[] PrimaryQuestions { get; set; }
        public Question[] SecondaryQuestions { get; set; }

        public SuspectRole[] Roles { get; set; }
    }
}