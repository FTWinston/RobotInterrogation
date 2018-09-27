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
        Task SetRole(bool isInterviewer);

        Task SetWaitingForPlayer();
        Task SetPlayersPresent();

        Task SwapPositions();

        Task ShowPenaltyChoice(List<string> options);
        Task WaitForPenaltyChoice();
        Task SetPenalty(string penalty);

        Task ShowPacketChoice(string[] options);
        Task WaitForPacketChoice();
        Task SetPacket(string packetName);

        Task ShowRoleSelection(List<SuspectRole> roles);

        Task ShowQuestions(List<string> primary, List<string> secondary);

        Task ShowSuspectNoteChoice(List<string> notes);
        Task WaitForSuspectNoteChoice();
        Task SetSuspectNote(string note);

        Task StartTimer(int duration);

        Task EndGame(int endType, SuspectRole role);
    }

    public class InterviewHub : Hub<IInterviewMessages>
    {
        public InterviewHub(InterviewService service, IOptions<GameConfiguration> configuration)
        {
            Service = service;
            Configuration = configuration.Value;
        }

        private static ConcurrentDictionary<string, string> UserSessions = new ConcurrentDictionary<string, string>();
        private string SessionID => UserSessions[Context.ConnectionId];

        private InterviewService Service { get; }
        private GameConfiguration Configuration { get; }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients
                .GroupExcept(SessionID, Context.ConnectionId)
                .EndGame((int)InterviewOutcome.Disconnected, null);

            Service.RemoveInterview(SessionID);
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
            if (!Service.TryGetInterview(session, out Interview interview))
                return false;

            if (interview.Status != InterviewStatus.WaitingForConnections)
                return false;

            if (!Service.TryAddUser(interview, Context.ConnectionId))
                return false;

            UserSessions[Context.ConnectionId] = session;
            await Groups.AddToGroupAsync(Context.ConnectionId, session);

            bool isInterviewer = interview.InterviewerConnectionID == Context.ConnectionId;

            await Clients.Caller.SetRole(isInterviewer);

            if (isInterviewer)
            {
                await Clients
                    .Group(session)
                    .SetWaitingForPlayer();
            }
            else // must be suspect, then
            {
                interview.Status = InterviewStatus.SelectingPositions;

                await Clients
                    .Group(session)
                    .SetPlayersPresent();
            }

            return true;
        }

        public async Task ConfirmPositions()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.SelectingPositions);

            EnsureIsInterviewer(interview);

            interview.Status = InterviewStatus.SelectingPenalty_Interviewer;

            Service.AllocatePenalties(interview);

            await Clients
                .Client(interview.InterviewerConnectionID)
                .ShowPenaltyChoice(interview.Penalties);

            await Clients
                .GroupExcept(SessionID, interview.InterviewerConnectionID)
                .WaitForPenaltyChoice();
        }

        public async Task SwapPositions()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.SelectingPositions);

            EnsureIsInterviewer(interview);

            var tmp = interview.InterviewerConnectionID;
            interview.InterviewerConnectionID = interview.SuspectConnectionID;
            interview.SuspectConnectionID = tmp;

            await Clients
                .Group(SessionID)
                .SwapPositions();
        }

        public async Task Select(int index)
        {
            var interview = Service.GetInterview(SessionID);

            if (interview.Status == InterviewStatus.SelectingPenalty_Interviewer)
            {
                await DiscardSinglePenalty(index, interview);
            }
            else if (interview.Status == InterviewStatus.SelectingPenalty_Suspect)
            {
                await AllocatePenalty(index, interview);

                await Task.Delay(3000);

                await ShowPacketChoice(interview);
            }
            else if (interview.Status == InterviewStatus.SelectingPacket)
            {
                EnsureIsInterviewer(interview);
                await SetPacket(interview, index);

                await Task.Delay(3000);

                await ShowRoleSelection(interview);
                await ShowQuestions(interview);
            }
            else if (interview.Status == InterviewStatus.SelectingRole)
            {
                EnsureIsSuspect(interview);
                AllocateRole(interview, index);

                await ShowSuspectNotes(interview);
            }
            else if (interview.Status == InterviewStatus.SelectingSuspectNote)
            {
                EnsureIsSuspect(interview);
                await SetSuspectNote(interview, index);
                interview.Status = InterviewStatus.ReadyToStart;
            }
            else
                throw new Exception("Invalid command for current status of session " + SessionID);
        }

        private async Task SetPacket(Interview interview, int index)
        {
            interview.Packet = Service.GetPacket(index);

            await Clients.Group(SessionID)
                .SetPacket(interview.Packet.Name);

            interview.Status = InterviewStatus.SelectingRole;
        }

        private async Task ShowRoleSelection(Interview interview)
        {
            Service.AllocateRoles(interview);

            await Clients
                .Client(interview.SuspectConnectionID)
                .ShowRoleSelection(interview.Roles);
        }

        private static void AllocateRole(Interview interview, int index)
        {
            var role = interview.Roles[index];

            for (int i = interview.Roles.Count - 1; i >= 0; i--)
            {
                if (i != index)
                    interview.Roles.RemoveAt(i);
            }
        }

        private async Task ShowQuestions(Interview interview)
        {
            Service.AllocateQuestions(interview);

            await Clients
                .Client(interview.InterviewerConnectionID)
                .ShowQuestions(interview.PrimaryQuestions, interview.SecondaryQuestions);
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
            interview.Status = InterviewStatus.SelectingPacket;

            // the specified index is the one to keep
            int removeIndex = index == 0 ? 1 : 0;
            interview.Penalties.RemoveAt(removeIndex);

            await Clients
                .Group(SessionID)
                .SetPenalty(interview.Penalties[0]);
        }

        private async Task ShowPacketChoice(Interview interview)
        {
            var packets = Service.GetAllPackets();

            await Clients
                .Client(interview.InterviewerConnectionID)
                .ShowPacketChoice(packets);

            await Clients
                .GroupExcept(SessionID, interview.InterviewerConnectionID)
                .WaitForPacketChoice();
        }

        private async Task ShowSuspectNotes(Interview interview)
        {
            Service.AllocateSuspectNotes(interview);
            interview.Status = InterviewStatus.SelectingSuspectNote;

            await Clients
                .Caller
                .ShowSuspectNoteChoice(interview.SuspectNotes);

            await Clients
                .GroupExcept(SessionID, Context.ConnectionId)
                .WaitForSuspectNoteChoice();
        }

        private async Task SetSuspectNote(Interview interview, int index)
        {
            int removeIndex = index == 0 ? 1 : 0;
            interview.SuspectNotes.RemoveAt(removeIndex);

            await Clients
                .Group(SessionID)
                .SetSuspectNote(interview.SuspectNotes[0]);
        }

        public async Task StartInterview()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.ReadyToStart);
            EnsureIsInterviewer(interview);

            await Clients
                .Group(SessionID)
                .StartTimer(Configuration.Duration);

            interview.Status = InterviewStatus.InProgress;
        }

        public async Task ConcludeInterview(bool isRobot)
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.InProgress);
            EnsureIsInterviewer(interview);

            var outcome = Service.GuessSuspectRole(interview, isRobot);

            await Clients
                .Group(SessionID)
                .EndGame((int)outcome, interview.Roles[0]);
        }

        public async Task KillInterviewer()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.InProgress);
            EnsureIsSuspect(interview);

            Service.KillInterviewer(interview);

            await Clients
                .Group(SessionID)
                .EndGame((int)InterviewOutcome.KilledInterviewer, interview.Roles[0]);
        }

        public async Task NewInterview()
        {
            Service.ResetInterview(SessionID);

            await Clients
                .Group(SessionID)
                .SetPlayersPresent();
        }
    }
}
