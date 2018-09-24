namespace RobotInterrogation.Models
{
    public class Packet
    {
        public string Name { get; set; }

        public string[] PrimaryQuestions { get; set; }
        public string[] SecondaryQuestions { get; set; }

        public SuspectRole Roles { get; set; }
    }
}