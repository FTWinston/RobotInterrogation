using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RobotInterrogation.Models;
using RobotInterrogation.Services;
using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace RobotInterrogation.Hubs
{
    public interface IInterviewMessages
    {
        Task SetRole(bool isInterviewer);

        Task SetWaitingForPlayer();
        Task SetPlayersPresent();

        /*
        Task SwapRoles();

        Task ShowPenaltyChoice(string[] choices);
        Task SetPenalty(string penalty);

        Task ShowPacketChoice(string[] packets);
        Task SetPacket(string packetName);

        Task ShowRoleChoice(string[] roles);

        Task ShowSuspectNoteChoice(string[] notes);
        Task SetSuspectNote(string note);

        Task ShowPrimaryQuestionChoice(string[] questions);
        Task ShowSecondaryQuestionChoice(string[] questions);

        Task SetStatus(int state);

        Task StartTimer();
        */

        Task EndGame(int endType);
    }

    public class InterviewHub : Hub<IInterviewMessages>
    {
        public InterviewHub(InterviewService service)
        {
            Service = service;
        }

        private static ConcurrentDictionary<string, string> UserSessions = new ConcurrentDictionary<string, string>();
        private string SessionID => UserSessions[Context.ConnectionId];

        private InterviewService Service { get; }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients
                .GroupExcept(SessionID, Context.ConnectionId)
                .EndGame(0);

            UserSessions.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task<bool> Join(string session)
        {
            if (!Service.TryAddUser(session, out Interview interview))
                return false;

            UserSessions[Context.ConnectionId] = session;
            await Groups.AddToGroupAsync(Context.ConnectionId, session);

            bool isFirst = interview.NumPlayers < 2;
            bool isInterviewer = interview.FirstPlayerIsInterviewer && isFirst;

            await Clients.Caller.SetRole(isInterviewer);

            if (isFirst)
            {
                await Clients
                    .Group(session)
                    .SetWaitingForPlayer();
            }
            else
            {
                await Clients
                    .Group(session)
                    .SetPlayersPresent();
            }

            return true;
        }

        public void SwapRoles()
        {
            // TODO: this would need to know your current role.
            // Aha, no it just sends a "swap role" message which swaps your current role... sneaky.
            throw new NotImplementedException();
        }

        public void SelectPenalty(string penalty)
        {
            throw new NotImplementedException();
        }

        public void SelectPacket(string packet)
        {
            throw new NotImplementedException();
        }

        public void SelectRole(string role)
        {
            throw new NotImplementedException();
        }

        public void SelectSuspectNote(string suspectNote)
        {
            throw new NotImplementedException();
        }

        public void SelectPrimaryQuestion(string question)
        {
            throw new NotImplementedException();
        }

        public void SelectSecondaryQuestion(string question)
        {
            throw new NotImplementedException();
        }

        public void StartInterview()
        {
            throw new NotImplementedException();
        }

        public void ConcludeInterview(bool isRobot)
        {
            throw new NotImplementedException();
        }

        public void KillInterviewer()
        {
            throw new NotImplementedException();
        }
    }
}
