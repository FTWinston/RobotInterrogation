﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace RobotInterrogation.Models
{
    public class Interview
    {
        public InterviewStatus Status { get; set; } = InterviewStatus.WaitingForConnections;
        public InterviewOutcome? Outcome { get; set; }

        public DateTime? Started { get; set; }

        public string InterviewerConnectionID { get; set; }

        public string SuspectConnectionID { get; set; }

        public List<string> Penalties { get; } = new List<string>();
        public List<string> SuspectNotes { get; } = new List<string>();

        public Packet Packet { get; set; }

        public List<SuspectRole> Roles { get; } = new List<SuspectRole>();

        public string Prompt { get; set;  }
        public List<Question> PrimaryQuestions { get; } = new List<Question>();
        public List<Question> SecondaryQuestions { get; } = new List<Question>();
    }
}
