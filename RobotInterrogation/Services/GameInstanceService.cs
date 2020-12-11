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
    public class GameInstanceService
    {
        private static ConcurrentDictionary<string, GameInstance> GameInstances = new ConcurrentDictionary<string, GameInstance>();

        private static Random IdGenerator = new Random();
        private GameConfiguration Configuration { get; }
        private IDGeneration IDs { get; }
        private InterferenceService InterferenceService { get; }
        private InterviewService InterviewService { get; }
        private ILogger Logger { get; }

        public const string LogName = "Interviews";

        public GameInstanceService(IOptions<GameConfiguration> configuration, IOptions<IDGeneration> idWords, InterviewService interviewService, InterferenceService interferenceService, ILoggerFactory logger)
        {
            Configuration = configuration.Value;
            IDs = idWords.Value;
            InterferenceService = interferenceService;
            InterviewService = interviewService;
            Logger = logger.CreateLogger(LogName);
        }

        public string GetNewGameInstanceID()
        {
            lock (IdGenerator)
            {
                string id = GenerateID();
                GameInstances[id.ToLower()] = new GameInstance();
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
            } while (GameInstances.ContainsKey(id.ToLower()));

            return id;
        }

        public bool TryAddUser(GameInstance gameInstance, string connectionID)
        {
            Player player;

            if (gameInstance.Interview.Status != InterviewStatus.WaitingForConnections)
                return false;

            if (gameInstance.Interview.InterviewerConnectionID == null)
            {
                player = new Player();
                player.ConnectionID = connectionID;
                player.Seat = PlayerSeat.Interviewer;
                gameInstance.Players.Add(player);
                gameInstance.Interview.InterviewerConnectionID = connectionID;
                return true;
            }

            if (gameInstance.Interview.SuspectConnectionID == null)
            {
                player = new Player();
                player.ConnectionID = connectionID;
                player.Seat = PlayerSeat.Suspect;
                gameInstance.Players.Add(player);
                gameInstance.Interview.SuspectConnectionID = connectionID;
                return true;
            }

            return false;
        }

        public void RemoveGameInstance(string gameInstanceID)
        {
            if (!GameInstances.TryRemove(gameInstanceID.ToLower(), out GameInstance gameInstance))
                return;

            if (gameInstance.Interview.Status == InterviewStatus.InProgress)
            {
                InterviewService.LogInterview(gameInstance.Interview);
            }
        }

        public bool TryGetGameInstance(string gameInstanceID, out GameInstance gameInstance)
        {
            return GameInstances.TryGetValue(gameInstanceID.ToLower(), out gameInstance);
        }

        public GameInstance GetGameInstance(string gameInstanceID)
        {
            if (!GameInstances.TryGetValue(gameInstanceID.ToLower(), out GameInstance gameInstance))
                throw new Exception($"Invalid interview ID: {gameInstanceID}");

            return gameInstance;
        }

        public GameInstance GetGameInstanceWithStatus(string gameInstanceID, InterviewStatus status)
        {
            var gameInstance = GetGameInstance(gameInstanceID);

            if (gameInstance.Interview.Status != status)
                throw new Exception($"Interview doesn't have the required status {status} - it is actually {gameInstance.Interview.Status}");

            return gameInstance;
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

        private Player GetPlayerBySeat(GameInstance gameInstance, PlayerSeat seat)
        {
            return gameInstance.Players.Where(p => p.Seat == seat).First();
        }

        public Player GetInterviewer(GameInstance gameInstance)
        {
            return GetPlayerBySeat(gameInstance, PlayerSeat.Interviewer);
        }

        public Player GetSuspect(GameInstance gameInstance)
        {
            return GetPlayerBySeat(gameInstance, PlayerSeat.Suspect);
        }

        public Interview ResetGameInstanceInterview(string gameInstanceID)
        {
            var gameInstance = GetGameInstanceWithStatus(gameInstanceID, InterviewStatus.Finished);
            var interviewerConnectionID = gameInstance.Interview.InterviewerConnectionID;
            var suspectConnectionID = gameInstance.Interview.SuspectConnectionID;

            gameInstance.Interview = new Interview();

            gameInstance.Interview.Status = InterviewStatus.SelectingPositions;
            gameInstance.Interview.InterviewerConnectionID = interviewerConnectionID;
            gameInstance.Interview.SuspectConnectionID = suspectConnectionID;

            return gameInstance.Interview;
        }
    }
}
