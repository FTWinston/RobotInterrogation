using System.Collections.Generic;

namespace RobotInterrogation.Models
{
    public class Interview
    {
        public InterviewStatus Status { get; set; } = InterviewStatus.WaitingForConnections;

        public string InterviewerConnectionID { get; set; }
        public string SuspectConnectionID { get; set; }

        public List<string> Penalties { get; } = new List<string>();

        public Packet Packet { get; set; }

        public SuspectRole Role { get; set; }
    }
}
