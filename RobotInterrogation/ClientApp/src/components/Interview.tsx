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
import { PenaltyCalibration } from './interviewParts/PenaltyCalibration';
import { SuspectInProgress } from './interviewParts/SuspectInProgress';
import { SuspectBackgroundSelection } from './interviewParts/SuspectBackgroundSelection';
import { SuspectPenaltySelection } from './interviewParts/SuspectPenaltySelection';
import { SuspectReadyToStart } from './interviewParts/SuspectReadyToStart';
import { Wait } from './interviewParts/Wait';
import { WaitingForOpponent } from './interviewParts/WaitingForOpponent';
import { WaitingQuestionDisplay } from './interviewParts/WaitingQuestionDisplay';
import { InterviewStatus, InterviewOutcome, interviewReducer, initialState, InterviewAction, InterviewPosition } from './interviewReducer';
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
            if (state.position === InterviewPosition.Interviewer) {
                const confirm = () => connection!.invoke('ConfirmPositions');
                const swap = () => connection!.invoke('SwapPositions');

                return <InterviewerPositionSelection stay={confirm} swap={swap} />;
            }
            else {
                return <Wait position={state.position} waitFor="the interviewer to confirm your respective roles" />;
            }

        case InterviewStatus.PenaltySelection:
            if (state.choice.length > 0) {
                const selectPenalty = (index: number) => connection!.invoke('Select', index);

                return state.position === InterviewPosition.Interviewer
                    ? <InterviewerPenaltySelection options={state.choice} action={selectPenalty} />
                    : <SuspectPenaltySelection options={state.choice} action={selectPenalty} />
            }
            else {
                const waitFor = state.position === InterviewPosition.Interviewer
                    ? 'the suspect to choose a penalty'
                    : 'the interviewer to discard a penalty';

                return (
                    <Wait
                        position={state.position}
                        waitFor={waitFor}
                    />
                )
            }

        case InterviewStatus.PenaltyCalibration:
            const confirmPenalty = state.position === InterviewPosition.Interviewer
                ? () => connection!.invoke('Select', 0)
                : undefined;

            return (
                <PenaltyCalibration
                    position={state.position}
                    penalty={state.penalty}
                    confirm={confirmPenalty}
                />
            );

        case InterviewStatus.PacketSelection:
            const selectPacket = (index: number) => connection!.invoke('Select', index);

            return state.position === InterviewPosition.Interviewer
                ? <PacketSelection options={state.choice} action={selectPacket} />
                : <Wait position={state.position} waitFor="the interviewer select an interview packet" />;

        case InterviewStatus.ShowingPacket:
            return <PacketDisplay position={state.position} packet={state.packet} />;

        case InterviewStatus.BackgroundSelection:
            if (state.position === InterviewPosition.Interviewer) {
                return (
                    <WaitingQuestionDisplay
                        primary={state.primaryQuestions}
                        secondary={state.secondaryQuestions}
                        waitingFor="background"
                    />
                );
            }
            else {
                const selectBackground = (index: number) => connection!.invoke('Select', index);
                return <SuspectBackgroundSelection options={state.choice} role={state.role!} action={selectBackground} />
            }

        case InterviewStatus.ReadyToStart:
            if (state.position === InterviewPosition.Interviewer) {
                const ready = () => connection!.invoke('StartInterview');

                return (
                    <InterviewerReadyToStart
                        primary={state.primaryQuestions}
                        prompt={state.prompt}
                        secondary={state.secondaryQuestions}
                        suspectBackground={state.suspectBackground}
                        penalty={state.penalty}
                        ready={ready}
                    />
                );
            }
            else {
                return (
                    <SuspectReadyToStart
                        role={state.role!}
                        suspectBackground={state.suspectBackground}
                        penalty={state.penalty}
                    />
                );
            }

        case InterviewStatus.InProgress:
            if (state.position === InterviewPosition.Interviewer) {
                const conclude = (isRobot: boolean) => connection!.invoke('ConcludeInterview', isRobot);

                return (
                    <InterviewerInProgress
                        conclude={conclude}
                        duration={state.duration}
                        penalty={state.penalty}
                        prompt={state.prompt}
                        primary={state.primaryQuestions}
                        secondary={state.secondaryQuestions}
                        suspectBackground={state.suspectBackground}
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
                        suspectBackground={state.suspectBackground}
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
                    position={state.position}
                    role={state.role!}
                    outcome={state.outcome!}
                    playAgain={playAgain}
                />
            );

        default:
            return <div>Unknown status</div>;
    }
}