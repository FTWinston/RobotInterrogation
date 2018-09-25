using RobotInterrogation.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace RobotInterrogation.Services
{
    public class InterviewService
    {
        private static ConcurrentDictionary<int, Interview> Interviews = new ConcurrentDictionary<int, Interview>();
        private static int NextInterviewID = 1;
        private static object IdLock = new object();

        public string GetNextInterviewID()
        {
            int id;

            lock (IdLock)
            {
                id = NextInterviewID++;
            }

            Interviews[id] = new Interview();

            return id.ToString();
        }

        public bool TryAddUser(Interview interview, string connectionID)
        {
            if (interview.Status != InterviewStatus.WaitingForConnections)
                return false;

            if (interview.InterviewerConnectionID == null)
            {
                interview.InterviewerConnectionID = connectionID;
                return true;
            }

            if (interview.SuspectConnectionID == null)
            {
                interview.SuspectConnectionID = connectionID;
                return true;
            }

            return false;
        }

        public void RemoveInterview(string interviewID)
        {
            int id = int.Parse(interviewID);
            Interviews.TryRemove(id, out _);
        }

        public Interview GetInterview(string interviewID)
        {
            int id = int.Parse(interviewID);

            if (!Interviews.TryGetValue(id, out Interview interview))
                throw new Exception($"Invalid interview ID: {interviewID}");

            return interview;
        }

        public Interview GetInterviewWithStatus(string interviewID, InterviewStatus status)
        {
            var interview = GetInterview(interviewID);

            if (interview.Status != status)
                throw new Exception($"Interview doesn't have the required status {status} - it is actually {interview.Status}");

            return interview;
        }

        public void AllocatePenalties(Interview interview)
        {
            // TODO: should be random, not just fixed
            interview.Penalties.Clear();
            interview.Penalties.Add("Swear");
            interview.Penalties.Add("Interrupt the interviewer");
            interview.Penalties.Add("Snap your fingers");
        }
    }
}
