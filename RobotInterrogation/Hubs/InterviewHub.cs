﻿using Microsoft.AspNetCore.SignalR;
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
        Task SetPosition(int position);

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

        Task SpectatorWaitForPenaltyChoice(List<string> options, int turn);
        Task SpectatorWaitForInducer(SuspectRole role, List<string> solution);
        Task SpectatorWaitForInducer(SuspectRole role, List<string> solution, int[][] connections, string[][] contents);
        Task SpectatorWaitForSuspectBackgroundChoice(List<string> notes);
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
            var player = Service.GetPlayerByConnectionID(Context.ConnectionId);
            if (player.Position == PlayerPosition.Spectator)
            {
                Service.RemovePlayer(player);
            }
            else
            {
                await Clients
                    .GroupExcept(SessionID, Context.ConnectionId)
                    .EndGame((int)InterviewOutcome.Disconnected, null);

                Service.RemoveInterview(SessionID);
                UserSessions.TryRemove(Context.ConnectionId, out _);
                await base.OnDisconnectedAsync(exception);
            }
        }

        private void EnsureIsInterviewer(Interview interview)
        {
            if (Context.ConnectionId != Service.GetInterviewerConnectionID(interview))
                throw new Exception("Only the interviewer can issue this command for session " + SessionID);
        }

        private void EnsureIsSuspect(Interview interview)
        {
            if (Context.ConnectionId != Service.GetSuspectConnectionID(interview))
                throw new Exception("Only the suspect can issue this command for session " + SessionID);
        }

        public async Task<bool> Join(string session)
        {
            if (!Service.TryGetInterview(session, out Interview interview))
                return false;

            //if (interview.Status != InterviewStatus.WaitingForConnections)
            //    return false;

            if (!Service.TryAddUser(interview, Context.ConnectionId))
                return false;

            UserSessions[Context.ConnectionId] = session;
            await Groups.AddToGroupAsync(Context.ConnectionId, session);

            var player = Service.GetPlayerByConnectionID(Context.ConnectionId);

            await Clients.Caller.SetPosition((int)player.Position);

            if (player.Position == PlayerPosition.Interviewer)
            {
                await Clients
                    .Group(session)
                    .SetWaitingForPlayer();
            }
            else if (player.Position == PlayerPosition.Suspect)
            {
                interview.Status = InterviewStatus.SelectingPositions;

                await Clients
                    .Group(session)
                    .SetPlayersPresent();
            } else //Spectator
            {
                var client = Clients.Client(Context.ConnectionId);
                switch (interview.Status)
                {
                    case InterviewStatus.WaitingForConnections:
                        await client.SetWaitingForPlayer();
                        break;
                    case InterviewStatus.SelectingPositions:
                        await client.SetPlayersPresent();
                        break;
                    case InterviewStatus.SelectingPenalty_Interviewer:
                        await client.SpectatorWaitForPenaltyChoice(interview.Penalties, (int)PlayerPosition.Interviewer);
                        break;
                    case InterviewStatus.SelectingPenalty_Suspect:
                        await client.SpectatorWaitForPenaltyChoice(interview.Penalties, (int)PlayerPosition.Suspect);
                        break;
                    case InterviewStatus.CalibratingPenalty:
                        await client.SetPenalty(interview.Penalties[0]);
                        break;
                    case InterviewStatus.SelectingPacket:
                        await client.WaitForPacketChoice();
                        break;
                    case InterviewStatus.PromptingInducer:
                    case InterviewStatus.SolvingInducer:
                        if (interview.Role.Type == SuspectRoleType.Human)
                            await client
                                .SpectatorWaitForInducer(
                                    interview.Role,
                                    interview.InterferencePattern.SolutionSequence,
                                    interview.InterferencePattern.Connections.ToJaggedArray(val => (int)val),
                                    interview.InterferencePattern.CellContents.ToJaggedArray(val => val ?? string.Empty)
                            );
                        else
                            await client
                                .SpectatorWaitForInducer(
                                    interview.Role,
                                    interview.InterferencePattern.SolutionSequence
                            );
                        break;
                    case InterviewStatus.SelectingSuspectBackground:
                        await client.SpectatorWaitForSuspectBackgroundChoice(interview.SuspectBackgrounds);
                        break;
                    case InterviewStatus.ReadyToStart:
                        await client.SetSuspectBackground(interview.SuspectBackgrounds[0]);
                        break;
                    case InterviewStatus.InProgress:
                        await client.StartTimer(Configuration.Duration);
                        break;
                    case InterviewStatus.Finished:
                        await client.EndGame((int)interview.Outcome, interview.Role);
                        break;
                }

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
                .Client(Service.GetInterviewerConnectionID(interview))
                .ShowPenaltyChoice(interview.Penalties);

            await Clients
                .Client(Service.GetSuspectConnectionID(interview))
                .WaitForPenaltyChoice();

            await Clients
                .GroupExcept(SessionID, Service.GetInterviewerConnectionID(interview), Service.GetSuspectConnectionID(interview))
                .SpectatorWaitForPenaltyChoice(interview.Penalties, (int)PlayerPosition.Interviewer);
        }

        public async Task SwapPositions()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.SelectingPositions);

            EnsureIsInterviewer(interview);

            var tmp = interview.InterviewerIndex;
            interview.InterviewerIndex = interview.SuspectIndex;
            interview.SuspectIndex = tmp;

            await Clients
                .Group(SessionID)
                .SwapPositions();
        }

        public async Task Select(int index)
        {
            var interview = Service.GetInterview(SessionID);

            switch (interview.Status)
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
                    Service.AllocateRole(interview);
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
            Service.SetPacketAndInducer(interview, index);

            await Clients.Group(SessionID)
                .SetPacket(interview.Packet.Name, interview.Packet.Prompt);
        }

        private async Task SetSuspectRole(Interview interview)
        {
            var suspectClient = Clients
                .Client(Service.GetSuspectConnectionID(interview));

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
                .Client(Service.GetInterviewerConnectionID(interview));
            
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
                .Client(Service.GetInterviewerConnectionID(interview))
                .WaitForPenaltyChoice();

            await Clients
                .Client(Service.GetSuspectConnectionID(interview))
                .ShowPenaltyChoice(interview.Penalties);

            await Clients
                .GroupExcept(SessionID, Service.GetInterviewerConnectionID(interview), Service.GetSuspectConnectionID(interview))
                .SpectatorWaitForPenaltyChoice(interview.Penalties, (int)PlayerPosition.Suspect);
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
            var packets = Service.GetAllPackets();

            await Clients
                .Client(Service.GetInterviewerConnectionID(interview))
                .ShowPacketChoice(packets);

            await Clients
                .GroupExcept(SessionID, Service.GetInterviewerConnectionID(interview))
                .WaitForPacketChoice();
        }

        private async Task ShowInducerPrompt(Interview interview)
        {
            await Clients
                .Client(Service.GetInterviewerConnectionID(interview))
                .ShowInducerPrompt(interview.InterferencePattern.SolutionSequence);

            await Clients
                .Client(Service.GetSuspectConnectionID(interview))
                .WaitForInducer();

            if (interview.Role.Type == SuspectRoleType.Human)
                await Clients
                    .GroupExcept(SessionID, Service.GetInterviewerConnectionID(interview), Service.GetSuspectConnectionID(interview))
                    .SpectatorWaitForInducer(
                        interview.Role,
                        interview.InterferencePattern.SolutionSequence,
                        interview.InterferencePattern.Connections.ToJaggedArray(val => (int)val),
                        interview.InterferencePattern.CellContents.ToJaggedArray(val => val ?? string.Empty)
                );
            else
                await Clients
                    .GroupExcept(SessionID, Service.GetInterviewerConnectionID(interview), Service.GetSuspectConnectionID(interview))
                    .SpectatorWaitForInducer(
                        interview.Role,
                        interview.InterferencePattern.SolutionSequence
                );
        }

        private async Task ShowSuspectBackgrounds(Interview interview, bool suspectCanChoose)
        {
            Service.AllocateSuspectBackgrounds(interview, suspectCanChoose ? 3 : 1);
            interview.Status = InterviewStatus.SelectingSuspectBackground;

            await Clients
                .Client(Service.GetInterviewerConnectionID(interview))
                .WaitForSuspectBackgroundChoice();

            await Clients
                .Client(Service.GetSuspectConnectionID(interview))
                .ShowSuspectBackgroundChoice(interview.SuspectBackgrounds);

            await Clients
                .GroupExcept(SessionID, Service.GetInterviewerConnectionID(interview), Service.GetSuspectConnectionID(interview))
                .SpectatorWaitForSuspectBackgroundChoice(interview.SuspectBackgrounds);
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
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.ReadyToStart);
            EnsureIsInterviewer(interview);

            await Clients
                .Group(SessionID)
                .StartTimer(Configuration.Duration);

            interview.Status = InterviewStatus.InProgress;
            interview.Started = DateTime.Now;
        }

        public async Task ConcludeInterview(bool isRobot)
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.InProgress);
            EnsureIsInterviewer(interview);

            // Cannot record the suspect as human before the time has elapsed.
            if (!isRobot && !Service.HasTimeElapsed(interview))
                return;

            var outcome = Service.GuessSuspectRole(interview, isRobot);

            await Clients
                .Group(SessionID)
                .EndGame((int)outcome, interview.Role);
        }

        public async Task KillInterviewer()
        {
            var interview = Service.GetInterviewWithStatus(SessionID, InterviewStatus.InProgress);
            EnsureIsSuspect(interview);

            Service.KillInterviewer(interview);

            await Clients
                .Group(SessionID)
                .EndGame((int)InterviewOutcome.KilledInterviewer, interview.Role);
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
