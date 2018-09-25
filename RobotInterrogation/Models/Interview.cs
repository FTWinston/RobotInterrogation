namespace RobotInterrogation.Models
{
    public class Interview
    {
        public InterviewStatus Status { get; set; } = InterviewStatus.WaitingForConnections;

        public int NumPlayers { get; set; } = 0;

        public bool FirstPlayerIsInterviewer { get; set; } = true;

        public Packet Packet { get; set; }

        public SuspectRole Role { get; set; }
    }
}
