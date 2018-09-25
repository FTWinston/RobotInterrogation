using RobotInterrogation.Models;
using System;
using System.Collections.Concurrent;

namespace RobotInterrogation.Services
{
    public class InterviewService
    {
        private static ConcurrentDictionary<int, Interview> Interviews = new ConcurrentDictionary<int, Interview>();
        private static int NextSessionID = 1;
        private static object IdLock = new object();

        public string GetNextSessionID()
        {
            int id;

            lock (IdLock)
            {
                id = NextSessionID++;
            }

            Interviews[id] = new Interview();

            return id.ToString();
        }

        public bool TryAddUser(string sessionID, out Interview interview)
        {
            int id = int.Parse(sessionID);

            if (!Interviews.TryGetValue(id, out interview))
                return false;

            if (interview.Status != InterviewStatus.WaitingForConnections)
                return false;

            if (interview.NumPlayers >= 2)
                return false;

            interview.NumPlayers++;
            return true;
        }

        public void RemoveSession(string sessionID)
        {
            int id = int.Parse(sessionID);
            Interviews.TryRemove(id, out _);
        }

        public bool ConfirmStatus(string sessionID, InterviewStatus status)
        {
            int id = int.Parse(sessionID);

            if (!Interviews.TryGetValue(id, out Interview interview))
                return false;

            return interview.Status == status;
        }

        public bool UpdateStatus(string sessionID, InterviewStatus currentStatus, InterviewStatus newStatus)
        {
            int id = int.Parse(sessionID);

            if (!Interviews.TryGetValue(id, out Interview interview))
                return false;

            if (interview.Status != currentStatus)
                return false;

            interview.Status = newStatus;
            return true;
        }
    }
}
