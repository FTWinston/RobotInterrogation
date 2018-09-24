using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;

namespace RobotInterrogation.Hubs
{
    public interface IInterviewMessages
    {
        Task SetOwnName(string playerName);
        Task SetOpponentName(string playerName);

        Task SetRole(bool isInterviewer);

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

        Task EndGame(int endType);

        Task SwapRoles();
    }

    public class InterviewHub : Hub<IInterviewMessages>
    {
        public override Task OnConnectedAsync()
        {
            return base.OnConnectedAsync();
        }

        public async Task Join(int session)
        {
            // join specific session

            throw new NotImplementedException();
        }

        public async Task SelectPenalty(string penalty)
        {
            throw new NotImplementedException();
        }

        public async Task SelectPacket(string packet)
        {
            throw new NotImplementedException();
        }

        public async Task SelectRole(string role)
        {
            throw new NotImplementedException();
        }

        public async Task SelectSuspectNote(string suspectNote)
        {
            throw new NotImplementedException();
        }

        public async Task SelectPrimaryQuestion(string question)
        {
            throw new NotImplementedException();
        }

        public async Task SelectSecondaryQuestion(string question)
        {
            throw new NotImplementedException();
        }

        public async Task StartInterview()
        {
            throw new NotImplementedException();
        }

        public async Task ConcludeInterview(bool isRobot)
        {
            throw new NotImplementedException();
        }

        public async Task KillInterviewer()
        {
            throw new NotImplementedException();
        }

        public async Task SwapRoles()
        {
            throw new NotImplementedException();
        }
    }
}
