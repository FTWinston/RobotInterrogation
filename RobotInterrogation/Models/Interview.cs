namespace RobotInterrogation.Models
{
    public class Interview
    {
        public InterviewStatus Status { get; private set; }

        public string FirstPlayerName { get; set; }
        public string SecondPlayerName { get; set; }
        public bool FirstPlayerIsInterviewer { get; set; }

        public Packet Packet { get; set; }

        public SuspectRole Role { get; set; }
    }
}
