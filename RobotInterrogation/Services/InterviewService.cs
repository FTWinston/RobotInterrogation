using RobotInterrogation.Models;
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
            {
                return false;
            }

            if (interview.NumPlayers >= 2)
            {
                return false;
            }

            interview.NumPlayers++;
            return true;
        }
    }
}
