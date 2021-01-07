using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RobotInterrogation.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace RobotInterrogation.Services
{
    public class InterviewService
    {
        private static ConcurrentDictionary<string, Player> Players = new ConcurrentDictionary<string, Player>();
        private static ConcurrentDictionary<string, Interview> Interviews = new ConcurrentDictionary<string, Interview>();

        private static Random IdGenerator = new Random();

        private GameConfiguration Configuration { get; }
        private IDGeneration IDs { get; }
        private InterferenceService InterferenceService { get; }
        private ILogger Logger { get; }

        public const string LogName = "Interviews";

        public InterviewService(IOptions<GameConfiguration> configuration, IOptions<IDGeneration> idWords, InterferenceService interferenceService, ILoggerFactory logger)
        {
            Configuration = configuration.Value;
            IDs = idWords.Value;
            InterferenceService = interferenceService;
            Logger = logger.CreateLogger(LogName);
        }

        public string GetNewInterviewID()
        {
            lock (IdGenerator)
            {
                var interview = new Interview();
                interview.InterviewID = GenerateID();
                Interviews[interview.InterviewID.ToLower()] = interview;
                return interview.InterviewID;
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

        public string GetInterviewerConnectionID(Interview interview)
        {
            return interview.Players[interview.InterviewerIndex].ConnectionID;
        }

        public string GetSuspectConnectionID(Interview interview)
        {
            return interview.Players[interview.SuspectIndex].ConnectionID;
        }

        public Player GetPlayerByConnectionID(string connectionID)
        {
            return Players[connectionID];
        }

        public bool TryAddUser(Interview interview, string connectionID)
        {
            if (interview.Players.Count >= Configuration.MaxPlayers)
                return false;

            var player = new Player();
            player.ConnectionID = connectionID;
            Players[connectionID] = player;
            interview.Players.Add(player);

            if (interview.InterviewerIndex == -1)
            {
                player.Position = PlayerPosition.Interviewer;
                interview.InterviewerIndex = interview.Players.Count - 1;
            } else if (interview.SuspectIndex == -1)
            {
                player.Position = PlayerPosition.Suspect;
                interview.SuspectIndex = interview.Players.Count - 1;
            } else
            {
                player.Position = PlayerPosition.Spectator;
            }

            player.InterviewID = interview.InterviewID;

            return true;
        }

        public void RemovePlayer(Player player)
        {
            GetInterview(player.InterviewID).Players.Remove(player);
            Players.Remove(player.ConnectionID, out Player p);
        }

        public void RemoveInterview(string interviewID)
        {
            Interview interview;
            if (!Interviews.TryRemove(interviewID.ToLower(), out interview))
            {
                foreach(Player player in interview.Players)
                    Players.TryRemove(player.ConnectionID, out Player p);
                return;
            }

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

        public bool HasTimeElapsed(Interview interview)
        {
            if (!interview.Started.HasValue)
                return false;

            return interview.Started.Value + TimeSpan.FromSeconds(Configuration.Duration)
                <= DateTime.Now;
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

        public PacketInfo[] GetAllPackets()
        {
            return Configuration.Packets;
        }

        public Packet GetPacket(int index)
        {
            return Configuration.Packets[index];
        }

        public void AllocateRole(Interview interview)
        {
            var possibleRoles = new List<SuspectRole>(interview.Packet.Roles);

            // Always have a 50% chance of being human.
            possibleRoles.AddRange(
                interview.Packet.Roles.Select(role => Configuration.HumanRole)
            );

            var roles = new List<SuspectRole>();

            AllocateRandomValues(possibleRoles, roles, 1);

            interview.Role = roles.First();
        }

        public void SetPacketAndInducer(Interview interview, int packetIndex)
        {
            interview.Packet = GetPacket(packetIndex);
            interview.InterferencePattern = InterferenceService.Generate(new Random());
        }

        public void AllocateSuspectBackgrounds(Interview interview, int numOptions)
        {
            AllocateRandomValues(Configuration.SuspectBackgrounds, interview.SuspectBackgrounds, numOptions);
        }

        public InterviewOutcome GuessSuspectRole(Interview interview, bool guessIsRobot)
        {
            var actualRole = interview.Role.Type;

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
            if (interview.Role.Type != SuspectRoleType.ViolentRobot)
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

            newInterview.InterviewID = interviewID;
            newInterview.Status = InterviewStatus.SelectingPositions;
            newInterview.Players.AddRange(oldInterview.Players);
            newInterview.InterviewerIndex = oldInterview.InterviewerIndex;
            newInterview.SuspectIndex = oldInterview.SuspectIndex;

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
                InterferencePattern = interview.InterferencePattern.ToString(),
                InterferenceSolution = interview.InterferencePattern.SolutionSequence,
                SuspectBackground = interview.SuspectBackgrounds.First(),
                SuspectType = interview.Role.Type,
                SuspectFault = interview.Role.Fault,
                SuspectTraits = interview.Role.Traits,
            };

            var options = new JsonSerializerOptions();
            options.Converters.Add(new JsonStringEnumConverter());
            var strData = JsonSerializer.Serialize(interviewData, options);

            Logger.LogInformation(
                "Interview completed at {Time}: {Data}",
                DateTime.Now,
                strData
            );
        }
    }
}
