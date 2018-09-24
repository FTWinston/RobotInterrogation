using RobotInterrogation.Models;
using System.Collections.Concurrent;

namespace RobotInterrogation.Services
{
    public class InterviewService
    {
        private static ConcurrentDictionary<int, Interview> Interviews = new ConcurrentDictionary<int, Interview>();
    }
}
