using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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

            Service.RemoveInterview(SessionID);
            UserSessions.TryRemove(Context.ConnectionId, out _);
            await base.OnDisconnectedAsync(exception);
        }

        private void EnsureIsInterviewer(Interview interview)
        {
            if (Context.ConnectionId != interview.InterviewerConnectionID)
                throw new Exception("Only the interviewer can issue this command for session " + SessionID);
        }

        public async Task<bool> Join(string session)
        {
            var interview = Service.GetInterviewWithStatus(session, InterviewStatus.WaitingForConnections);

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
                interview.Status = InterviewStatus.PositionSelection;

                await Clients
                    .Group(session)
                    .SetPlayersPresent();
            }

            return true;
        }

        public async Task ConfirmPositions()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.PositionSelection);

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
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.PositionSelection);

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
                interview.Status = InterviewStatus.SelectingPenalty_Suspect;

                if (index < 0 || index >= interview.Penalties.Count)
                    throw new IndexOutOfRangeException($"Interviewer penalty selection must be between 0 and {interview.Penalties.Count}, but is {index}");

                interview.Penalties.RemoveAt(0);

                // TODO: remove selection from interview penalties

                await Clients
                    .Client(interview.SuspectConnectionID)
                    .ShowPenaltyChoice(interview.Penalties);

                await Clients
                    .GroupExcept(SessionID, interview.SuspectConnectionID)
                    .WaitForPenaltyChoice();
            }
            else if (interview.Status == InterviewStatus.SelectingPenalty_Suspect)
            {
                interview.Status = InterviewStatus.SelectingPacket;

                // the specified index is the one to keep
                int removeIndex = index == 0 ? 1 : 0;
                interview.Penalties.RemoveAt(removeIndex);

                await Clients
                    .Group(SessionID)
                    .SetPenalty(interview.Penalties[0]);

                // This will show the penalty. Wait 5 seconds before moving onto packet selection.
                await Task.Delay(5000);

                // ...
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
