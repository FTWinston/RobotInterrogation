using System;
using System.Collections.Generic;

namespace RobotInterrogation.Models
{
    public class Interview
    {
        public InterviewStatus Status { get; set; } = InterviewStatus.WaitingForConnections;

        public InterviewOutcome? Outcome { get; set; }

        public DateTime? Started { get; set; }

        public List<Player> Players { get; } = new List<Player>();

        public int InterviewerIndex { get; set; } = -1;

        public int SuspectIndex { get; set; } = -1;

        public List<string> Penalties { get; } = new List<string>();
        
        public List<string> SuspectBackgrounds { get; } = new List<string>();

        public Packet Packet { get; set; }

        public SuspectRole Role { get; set; }

        public string Prompt { get; set;  }

        public InterferencePattern InterferencePattern { get; set; }
        
        public List<Question> PrimaryQuestions { get; } = new List<Question>();
        
        public List<Question> SecondaryQuestions { get; } = new List<Question>();
    }
}
