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

        Task SwapPositions();

        Task SetPenaltyChoice(string[] options);
        Task ChoosePenalty(int index);

        /*
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

            Service.RemoveSession(SessionID);
            UserSessions.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task<bool> Join(string session)
        {
            if (!Service.ConfirmStatus(session, InterviewStatus.WaitingForConnections))
                throw new Exception("Invalid command for curent status of session " + SessionID);

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
                if (!Service.UpdateStatus(SessionID, InterviewStatus.WaitingForConnections, InterviewStatus.PositionSelection))
                    throw new Exception("Invalid command for curent status of session " + SessionID);

                await Clients
                    .Group(session)
                    .SetPlayersPresent();
            }

            return true;
        }

        public async Task ConfirmPositions()
        {
            if (!Service.UpdateStatus(SessionID, InterviewStatus.PositionSelection, InterviewStatus.SelectingPenalty_Interviewer))
                throw new Exception("Invalid command for curent status of session " + SessionID);

            // TODO: not a static list
            var penalties = new string[] { "Swear", "Interrupt the interviewer", "Snap your fingers" };

            await Clients
                .Group(SessionID)
                .SetPenaltyChoice(penalties);
        }

        public async Task SwapPositions()
        {
            if (!Service.ConfirmStatus(SessionID, InterviewStatus.PositionSelection))
                throw new Exception("Invalid command for curent status of session " + SessionID);

            await Clients
                .Group(SessionID)
                .SwapPositions();
        }

        public async Task Select(int index)
        {
            if (Service.UpdateStatus(SessionID, InterviewStatus.SelectingPenalty_Interviewer, InterviewStatus.SelectingPenalty_Suspect))
            {
                await Clients
                    .Group(SessionID)
                    .ChoosePenalty(index);
            }
            else if (Service.UpdateStatus(SessionID, InterviewStatus.SelectingPenalty_Suspect, InterviewStatus.SelectingPacket))
            {
                await Clients
                    .Group(SessionID)
                    .ChoosePenalty(index);

                // This will show the penalty. Wait 5 seconds before moving onto packet selection.
                await Task.Delay(5000);
            }
            else
                throw new Exception("Invalid command for curent status of session " + SessionID);
        }

        /*
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
        */
    }
}
