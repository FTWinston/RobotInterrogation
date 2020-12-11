using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using RobotInterrogation.Models;
using RobotInterrogation.Services;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RobotInterrogation.Hubs
{
    public interface IInterviewMessages
    {
        Task SetPosition(bool isInterviewer);

        Task SetWaitingForPlayer();
        Task SetPlayersPresent();

        Task SwapPositions();

        Task ShowPenaltyChoice(List<string> options);
        Task WaitForPenaltyChoice();
        Task SetPenalty(string penalty);

        Task ShowPacketChoice(PacketInfo[] options);
        Task WaitForPacketChoice();
        Task SetPacket(string packetName, string packetPrompt);

        Task ShowInducerPrompt(List<string> solution);
        Task WaitForInducer();

        Task SetRoleWithPattern(SuspectRole role, int[][] connections, string[][] contents);
        Task SetRoleWithSolution(SuspectRole role, List<string> solution);

        Task SetQuestions(IList<Question> questions);

        Task ShowInducer();

        Task ShowSuspectBackgroundChoice(List<string> notes);
        Task WaitForSuspectBackgroundChoice();
        Task SetSuspectBackground(string note);

        Task StartTimer(int duration);

        Task EndGame(int endType, SuspectRole role);
    }

    public class InterviewHub : Hub<IInterviewMessages>
    {
        public InterviewHub(InterviewService interviewService, GameInstanceService gameInstanceService, IOptions<GameConfiguration> configuration)
        {
            this.InterviewService = interviewService;
            this.GameInstanceService = gameInstanceService;
            Configuration = configuration.Value;
        }

        private static ConcurrentDictionary<string, string> UserSessions = new ConcurrentDictionary<string, string>();
        private string SessionID => UserSessions[Context.ConnectionId];

        private InterviewService InterviewService { get; }
        private GameInstanceService GameInstanceService { get; }
        private GameConfiguration Configuration { get; }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients
                .GroupExcept(SessionID, Context.ConnectionId)
                .EndGame((int)InterviewOutcome.Disconnected, null);

            GameInstanceService.RemoveGameInstance(SessionID);
            UserSessions.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        private void EnsureIsInterviewer(Interview interview)
        {
            if (Context.ConnectionId != interview.InterviewerConnectionID)
                throw new Exception("Only the interviewer can issue this command for session " + SessionID);
        }

        private void EnsureIsSuspect(Interview interview)
        {
            if (Context.ConnectionId != interview.SuspectConnectionID)
                throw new Exception("Only the suspect can issue this command for session " + SessionID);
        }

        public async Task<bool> Join(string session)
        {
            if (!GameInstanceService.TryGetGameInstance(session, out GameInstance gameInstance))
                return false;

            if (gameInstance.Interview.Status != InterviewStatus.WaitingForConnections)
                return false;

            if (!GameInstanceService.TryAddUser(gameInstance, Context.ConnectionId))
                return false;

            UserSessions[Context.ConnectionId] = session;
            await Groups.AddToGroupAsync(Context.ConnectionId, session);

            bool isInterviewer = gameInstance.Interview.InterviewerConnectionID == Context.ConnectionId;

            await Clients.Caller.SetPosition(isInterviewer);

            if (isInterviewer)
            {
                await Clients
                    .Group(session)
                    .SetWaitingForPlayer();
            }
            else // must be suspect, then
            {
                gameInstance.Interview.Status = InterviewStatus.SelectingPositions;

                await Clients
                    .Group(session)
                    .SetPlayersPresent();
            }

            return true;
        }

        public async Task ConfirmPositions()
        {
            var gameInstance = GameInstanceService.GetGameInstanceWithStatus(SessionID, InterviewStatus.SelectingPositions);

            EnsureIsInterviewer(gameInstance.Interview);

            gameInstance.Interview.Status = InterviewStatus.SelectingPenalty_Interviewer;

            InterviewService.AllocatePenalties(gameInstance.Interview);

            await Clients
                .Client(gameInstance.Interview.InterviewerConnectionID)
                .ShowPenaltyChoice(gameInstance.Interview.Penalties);

            await Clients
                .GroupExcept(SessionID, gameInstance.Interview.InterviewerConnectionID)
                .WaitForPenaltyChoice();
        }

        public async Task SwapPositions()
        {
            var gameInstance = GameInstanceService.GetGameInstanceWithStatus(SessionID, InterviewStatus.SelectingPositions);

            EnsureIsInterviewer(gameInstance.Interview);

            var newInterviewer = GameInstanceService.GetSuspect(gameInstance);
            var newSuspect = GameInstanceService.GetInterviewer(gameInstance);

            newInterviewer.Seat = PlayerSeat.Interviewer;
            newSuspect.Seat = PlayerSeat.Suspect;

            gameInstance.Interview.InterviewerConnectionID = newInterviewer.ConnectionID;
            gameInstance.Interview.SuspectConnectionID = newSuspect.ConnectionID;

            await Clients
                .Group(SessionID)
                .SwapPositions();
        }

        public async Task Select(int index)
        {
            var gameInstance = GameInstanceService.GetGameInstance(SessionID);
            var interview = gameInstance.Interview;

            switch (gameInstance.Interview.Status)
            {
                case InterviewStatus.SelectingPenalty_Interviewer:
                    await DiscardSinglePenalty(index, interview);
                    break;

                case InterviewStatus.SelectingPenalty_Suspect:
                    await AllocatePenalty(index, interview);
                    break;

                case InterviewStatus.CalibratingPenalty:
                    EnsureIsInterviewer(interview);

                    interview.Status = InterviewStatus.SelectingPacket;

                    await ShowPacketChoice(interview);
                    break;

                case InterviewStatus.SelectingPacket:
                    EnsureIsInterviewer(interview);
                    await SetPacket(interview, index);
                    await ShowInducerPrompt(interview);
                    interview.Status = InterviewStatus.PromptingInducer;
                    break;

                case InterviewStatus.PromptingInducer:
                    await SetSuspectRole(interview);
                    await ShowQuestions(interview);
                    interview.Status = InterviewStatus.SolvingInducer;
                    break;

                case InterviewStatus.SolvingInducer:
                    EnsureIsInterviewer(interview);

                    await ShowSuspectBackgrounds(interview, index == 0);
                    interview.Status = InterviewStatus.SelectingSuspectBackground;
                    break;

                case InterviewStatus.SelectingSuspectBackground:
                    EnsureIsSuspect(interview);
                    await SetSuspectBackground(interview, index);
                    interview.Status = InterviewStatus.ReadyToStart;
                    break;

                default:
                    throw new Exception("Invalid command for current status of session " + SessionID);
            }
        }

        private async Task SetPacket(Interview interview, int index)
        {
            InterviewService.SetPacketAndInducer(interview, index);

            await Clients.Group(SessionID)
                .SetPacket(interview.Packet.Name, interview.Packet.Prompt);
        }

        private async Task SetSuspectRole(Interview interview)
        {
            InterviewService.AllocateRole(interview);

            var suspectClient = Clients
                .Client(interview.SuspectConnectionID);

            var pattern = interview.InterferencePattern;

            if (interview.Role.Type == SuspectRoleType.Human)
            {
                await suspectClient
                    .SetRoleWithPattern(
                        interview.Role,
                        pattern.Connections.ToJaggedArray(val => (int)val),
                        pattern.CellContents.ToJaggedArray(val => val ?? string.Empty)
                    );

                await suspectClient.ShowInducer();
            }
            else
            {
                await suspectClient
                    .SetRoleWithSolution(interview.Role, pattern.SolutionSequence);

                await suspectClient.ShowInducer();
            }
        }

        private async Task ShowQuestions(Interview interview)
        {
            var interviewer = Clients
                .Client(interview.InterviewerConnectionID);
            
            await interviewer
                .SetQuestions(interview.Packet.Questions);

            await interviewer.ShowInducer();
        }

        private async Task DiscardSinglePenalty(int index, Interview interview)
        {
            interview.Status = InterviewStatus.SelectingPenalty_Suspect;

            if (index < 0 || index >= interview.Penalties.Count)
                throw new IndexOutOfRangeException($"Interviewer penalty selection must be between 0 and {interview.Penalties.Count}, but is {index}");

            interview.Penalties.RemoveAt(index);

            await Clients
                .Client(interview.SuspectConnectionID)
                .ShowPenaltyChoice(interview.Penalties);

            await Clients
                .GroupExcept(SessionID, interview.SuspectConnectionID)
                .WaitForPenaltyChoice();
        }

        private async Task AllocatePenalty(int index, Interview interview)
        {
            interview.Status = InterviewStatus.CalibratingPenalty;

            // the specified index is the one to keep
            int removeIndex = index == 0 ? 1 : 0;
            interview.Penalties.RemoveAt(removeIndex);

            await Clients
                .Group(SessionID)
                .SetPenalty(interview.Penalties[0]);
        }

        private async Task ShowPacketChoice(Interview interview)
        {
            var packets = InterviewService.GetAllPackets();

            await Clients
                .Client(interview.InterviewerConnectionID)
                .ShowPacketChoice(packets);

            await Clients
                .GroupExcept(SessionID, interview.InterviewerConnectionID)
                .WaitForPacketChoice();
        }

        private async Task ShowInducerPrompt(Interview interview)
        {
            await Clients
                .Client(interview.InterviewerConnectionID)
                .ShowInducerPrompt(interview.InterferencePattern.SolutionSequence);

            await Clients
                .GroupExcept(SessionID, interview.InterviewerConnectionID)
                .WaitForInducer();
        }

        private async Task ShowSuspectBackgrounds(Interview interview, bool suspectCanChoose)
        {
            InterviewService.AllocateSuspectBackgrounds(interview, suspectCanChoose ? 3 : 1);
            interview.Status = InterviewStatus.SelectingSuspectBackground;

            await Clients
                .Client(interview.SuspectConnectionID)
                .ShowSuspectBackgroundChoice(interview.SuspectBackgrounds);

            await Clients
                .GroupExcept(SessionID, interview.SuspectConnectionID)
                .WaitForSuspectBackgroundChoice();
        }

        private async Task SetSuspectBackground(Interview interview, int index)
        {
            var background = interview.SuspectBackgrounds[index];
            interview.SuspectBackgrounds.Clear();
            interview.SuspectBackgrounds.Add(background);

            await Clients
                .Group(SessionID)
                .SetSuspectBackground(interview.SuspectBackgrounds[0]);
        }

        public async Task StartInterview()
        {
            var gameInstance = GameInstanceService.GetGameInstanceWithStatus(SessionID, InterviewStatus.ReadyToStart);
            EnsureIsInterviewer(gameInstance.Interview);

            await Clients
                .Group(SessionID)
                .StartTimer(Configuration.Duration);

            gameInstance.Interview.Status = InterviewStatus.InProgress;
            gameInstance.Interview.Started = DateTime.Now;
        }

        public async Task ConcludeInterview(bool isRobot)
        {
            var gameInstance = GameInstanceService.GetGameInstanceWithStatus(SessionID, InterviewStatus.InProgress);
            EnsureIsInterviewer(gameInstance.Interview);

            // Cannot record the suspect as human before the time has elapsed.
            if (!isRobot && !InterviewService.HasTimeElapsed(gameInstance.Interview))
                return;

            var outcome = InterviewService.GuessSuspectRole(gameInstance.Interview, isRobot);

            await Clients
                .Group(SessionID)
                .EndGame((int)outcome, gameInstance.Interview.Role);
        }

        public async Task KillInterviewer()
        {
            var gameInstance = GameInstanceService.GetGameInstanceWithStatus(SessionID, InterviewStatus.InProgress);
            EnsureIsSuspect(gameInstance.Interview);

            InterviewService.KillInterviewer(gameInstance.Interview);

            await Clients
                .Group(SessionID)
                .EndGame((int)InterviewOutcome.KilledInterviewer, gameInstance.Interview.Role);
        }

        public async Task NewInterview()
        {
            GameInstanceService.ResetGameInstanceInterview(SessionID);

            await Clients
                .Group(SessionID)
                .SetPlayersPresent();
        }
    }
}
