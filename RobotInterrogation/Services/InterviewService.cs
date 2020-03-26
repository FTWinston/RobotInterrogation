using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using RobotInterrogation.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace RobotInterrogation.Services
{
    public class InterviewService
    {
        private static ConcurrentDictionary<string, Interview> Interviews = new ConcurrentDictionary<string, Interview>();

        private static Random IdGenerator = new Random();

        private GameConfiguration Configuration { get; }
        private IDGeneration IDs { get; }
        private ILogger Logger { get; }

        public const string LogName = "Interviews";

        public InterviewService(IOptions<GameConfiguration> configuration, IOptions<IDGeneration> idWords, ILoggerFactory logger)
        {
            Configuration = configuration.Value;
            IDs = idWords.Value;
            Logger = logger.CreateLogger(LogName);
        }

        public string GetNewInterviewID()
        {
            lock (IdGenerator)
            {
                string id = GenerateID();
                Interviews[id.ToLower()] = new Interview();
                return id;
            }
        }

        private string GenerateID()
        {
            if (IDs.WordCount <= 0)
                return string.Empty;

            string id;
            do
            {
                int[] iWords = new int[IDs.WordCount];

                for (int i = 0; i < IDs.WordCount; i++)
                {
                    do
                    {
                        int iWord = IdGenerator.Next(IDs.Words.Length);

                        bool reused = iWords
                            .Take(i)
                            .Any(jWord => jWord == iWord);

                        if (reused)
                            continue;

                        iWords[i] = iWord;
                        break;
                    } while (true);
                }

                id = string.Join("", iWords.Select(i => IDs.Words[i]));
            } while (Interviews.ContainsKey(id.ToLower()));

            return id;
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
            if (!Interviews.TryRemove(interviewID.ToLower(), out Interview interview))
                return;

            if (interview.Status == InterviewStatus.InProgress)
            {
                LogInterview(interview);
            }
        }

        public bool TryGetInterview(string interviewID, out Interview interview)
        {
            return Interviews.TryGetValue(interviewID.ToLower(), out interview);
        }

        public Interview GetInterview(string interviewID)
        {
            if (!Interviews.TryGetValue(interviewID.ToLower(), out Interview interview))
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

        private void AllocateRandomValues<T>(IList<T> source, IList<T> destination, int targetNum)
        {
            destination.Clear();

            var random = new Random();

            while (destination.Count < targetNum)
            {
                int iSelection = random.Next(source.Count);
                T selection = source[iSelection];

                if (destination.Contains(selection))
                    continue;

                destination.Add(selection);
            }
        }

        public void AllocatePenalties(Interview interview)
        {
            AllocateRandomValues(Configuration.Penalties, interview.Penalties, 3);
        }

        public string[] GetAllPackets()
        {
            return Configuration.Packets
                .Select(p => p.Description)
                .ToArray();
        }

        public Packet GetPacket(int index)
        {
            return Configuration.Packets[index];
        }

        public void AllocateRoles(Interview interview)
        {
            AllocateRandomValues(interview.Packet.Roles, interview.Roles, 3);
        }

        public void AllocateQuestions(Interview interview)
        {
            AllocateRandomValues(interview.Packet.PrimaryQuestions, interview.PrimaryQuestions, 2);
            AllocateRandomValues(interview.Packet.SecondaryQuestions, interview.SecondaryQuestions, 2);
        }

        public void AllocateSuspectNotes(Interview interview)
        {
            AllocateRandomValues(Configuration.SuspectNotes, interview.SuspectNotes, 2);
        }

        public InterviewOutcome GuessSuspectRole(Interview interview, bool guessIsRobot)
        {
            var actualRole = interview.Roles[0].Type;
            InterviewOutcome outcome;

            if (guessIsRobot)
            {
                outcome = actualRole == SuspectRoleType.Human
                    ? InterviewOutcome.WronglyGuessedRobot
                    : InterviewOutcome.CorrectlyGuessedRobot;
            }
            else
            {
                outcome = actualRole == SuspectRoleType.Human
                    ? InterviewOutcome.CorrectlyGuessedHuman
                    : InterviewOutcome.WronglyGuessedHuman;
            }

            interview.Status = InterviewStatus.Finished;
            interview.Outcome = outcome;

            LogInterview(interview);

            return outcome;
        }

        public void KillInterviewer(Interview interview)
        {
            if (interview.Roles[0].Type != SuspectRoleType.ViolentRobot)
            {
                throw new Exception("Suspect is not a violent robot, so cannot kill interviewer");
            }

            interview.Status = InterviewStatus.Finished;
            interview.Outcome = InterviewOutcome.KilledInterviewer;

            LogInterview(interview);
        }

        public Interview ResetInterview(string interviewID)
        {
            var oldInterview = GetInterviewWithStatus(interviewID, InterviewStatus.Finished);

            var newInterview = new Interview();
            Interviews[interviewID.ToLower()] = newInterview;

            newInterview.Status = InterviewStatus.SelectingPositions;
            newInterview.InterviewerConnectionID = oldInterview.InterviewerConnectionID;
            newInterview.SuspectConnectionID = oldInterview.SuspectConnectionID;

            return newInterview;
        }

        private void LogInterview(Interview interview)
        {
            var duration = interview.Started.HasValue
                ? DateTime.Now - interview.Started.Value
                : TimeSpan.Zero;

            var interviewData = new
            {
                interview.Status,
                interview.Outcome,
                Duration = duration,
                Packet = interview.Packet.Name,
                PrimaryQuestions = interview.PrimaryQuestions.Select(q => q.Challenge).ToArray(),
                SecondaryQuestions = interview.SecondaryQuestions.Select(q => q.Challenge).ToArray(),
                SuspectNote = interview.SuspectNotes.First(),
                SuspectType = interview.Roles.First().Type,
                SuspectFault = interview.Roles.First().Fault,
                SuspectTraits = interview.Roles.First().Traits,
            };

            var strData = JsonConvert.SerializeObject(interviewData);

            Logger.LogInformation(
                "Interview completed at {Time}: {Data}",
                DateTime.Now,
                strData
            );
        }
    }
}
