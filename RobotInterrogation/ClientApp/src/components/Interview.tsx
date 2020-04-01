import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { Disconnected } from './interviewParts/Disconnected';
import { InterviewerInProgress } from './interviewParts/InterviewerInProgress';
import { InterviewerPenaltySelection } from './interviewParts/InterviewerPenaltySelection';
import { InterviewerPositionSelection } from './interviewParts/InterviewerPositionSelection';
import { InterviewerReadyToStart } from './interviewParts/InterviewerReadyToStart';
import { InterviewFinished } from './interviewParts/InterviewFinished';
import { NotYetConnected } from './interviewParts/NotYetConnected';
import { OpponentDisconnected } from './interviewParts/OpponentDisconnected';
import { PacketDisplay } from './interviewParts/PacketDisplay';
import { PacketSelection } from './interviewParts/PacketSelection';
import { PenaltyDisplay } from './interviewParts/PenaltyDisplay';
import { SuspectInProgress } from './interviewParts/SuspectInProgress';
import { SuspectBackgroundSelection } from './interviewParts/SuspectBackgroundSelection';
import { SuspectPenaltySelection } from './interviewParts/SuspectPenaltySelection';
import { SuspectReadyToStart } from './interviewParts/SuspectReadyToStart';
import { Wait } from './interviewParts/Wait';
import { WaitingForOpponent } from './interviewParts/WaitingForOpponent';
import { WaitingQuestionDisplay } from './interviewParts/WaitingQuestionDisplay';
import { InterviewStatus, InterviewOutcome, interviewReducer, initialState, InterviewAction } from './interviewReducer';
import { useReducer, useEffect, useState } from 'react';
import { connectInterview } from './connectInterview';

export const Interview: React.FunctionComponent<RouteComponentProps<{ id: string }>> = props => {
    const [state, dispatch] = useReducer(interviewReducer, initialState);

    const [connection, setConnection] = useState<signalR.HubConnection>();

    useEffect(
        () => {
            const connect = async () => {
                const newConnection = await connectInterview(props.match.params.id, dispatch);
                setConnection(newConnection);
            }

            connect();
        },
        []
    );

    switch (state.status) {
        case InterviewStatus.InvalidSession:
            return <Redirect to="/" />;

        case InterviewStatus.NotConnected:
            return <NotYetConnected />;

        case InterviewStatus.Disconnected:
            return <Disconnected />;

        case InterviewStatus.WaitingForOpponent:
            return <WaitingForOpponent interviewID={props.match.params.id} />;

        case InterviewStatus.SelectingPositions:
            if (state.isInterviewer) {
                const confirm = () => connection!.invoke('ConfirmPositions');
                const swap = () => connection!.invoke('SwapPositions');

                return <InterviewerPositionSelection stay={confirm} swap={swap} />;
            }
            else {
                return <Wait role="suspect" waitFor="the interviewer to confirm your respective roles" />;
            }

        case InterviewStatus.PenaltySelection:
            if (state.choice.length > 0) {
                const selectPenalty = (index: number) => connection!.invoke('Select', index);

                return state.isInterviewer
                    ? <InterviewerPenaltySelection options={state.choice} action={selectPenalty} />
                    : <SuspectPenaltySelection options={state.choice} action={selectPenalty} />
            }
            else {
                return state.isInterviewer
                    ? <Wait role="interviewer" waitFor="the suspect to choose a penalty" />
                    : <Wait role="suspect" waitFor="the interviewer to discard a penalty" />;
            }

        case InterviewStatus.ShowingPenalty:
            return <PenaltyDisplay role={state.isInterviewer ? 'interviewer' : 'suspect'} penalty={state.penalty} />;

        case InterviewStatus.PacketSelection:
            const selectPacket = (index: number) => connection!.invoke('Select', index);

            return state.isInterviewer
                ? <PacketSelection options={state.choice} action={selectPacket} />
                : <Wait role="suspect" waitFor="the interviewer select an interview packet" />;

        case InterviewStatus.ShowingPacket:
            return <PacketDisplay role={state.isInterviewer ? 'interviewer' : 'suspect'} packet={state.packet} />;

        case InterviewStatus.BackgroundSelection:
            if (state.isInterviewer) {
                return (
                    <WaitingQuestionDisplay
                        primary={state.primaryQuestions}
                        secondary={state.secondaryQuestions}
                        waitingFor="background"
                    />
                );
            }
            else {
                const selectNote = (index: number) => connection!.invoke('Select', index);
                return <SuspectBackgroundSelection options={state.choice} role={state.role!} action={selectNote} />
            }

        case InterviewStatus.ReadyToStart:
            if (state.isInterviewer) {
                const ready = () => connection!.invoke('StartInterview');

                return (
                    <InterviewerReadyToStart
                        primary={state.primaryQuestions}
                        prompt={state.prompt}
                        secondary={state.secondaryQuestions}
                        suspectNote={state.suspectNote}
                        penalty={state.penalty}
                        ready={ready}
                    />
                );
            }
            else {
                return (
                    <SuspectReadyToStart
                        role={state.role!}
                        suspectNote={state.suspectNote}
                        penalty={state.penalty}
                    />
                );
            }

        case InterviewStatus.InProgress:
            if (state.isInterviewer) {
                const conclude = (isRobot: boolean) => connection!.invoke('ConcludeInterview', isRobot);

                return (
                    <InterviewerInProgress
                        conclude={conclude}
                        duration={state.duration}
                        penalty={state.penalty}
                        prompt={state.prompt}
                        primary={state.primaryQuestions}
                        secondary={state.secondaryQuestions}
                        suspectNote={state.suspectNote}
                    />
                );
            }
            else {
                const terminate = () => connection!.invoke('KillInterviewer');

                return (
                    <SuspectInProgress
                        duration={state.duration}
                        penalty={state.penalty}
                        role={state.role!}
                        suspectNote={state.suspectNote}
                        terminateInterviewer={terminate}
                    />
                );
            }

        case InterviewStatus.Finished:
            if (state.outcome! === InterviewOutcome.Disconnected) {
                return <OpponentDisconnected />;
            }

            const playAgain = () => connection!.invoke('NewInterview');

            return (
                <InterviewFinished
                    isInterviewer={state.isInterviewer}
                    role={state.role!}
                    outcome={state.outcome!}
                    playAgain={playAgain}
                />
            );

        default:
            return <div>Unknown status</div>;
    }
}