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
import { InducerWait } from './interviewParts/InducerWait';
import { PacketSelection } from './interviewParts/PacketSelection';
import { PenaltyCalibration } from './interviewParts/PenaltyCalibration';
import { SuspectInProgress } from './interviewParts/SuspectInProgress';
import { SuspectBackgroundSelection } from './interviewParts/SuspectBackgroundSelection';
import { SuspectPenaltySelection } from './interviewParts/SuspectPenaltySelection';
import { SuspectReadyToStart } from './interviewParts/SuspectReadyToStart';
import { WaitPacketSelection } from './interviewParts/WaitPacketSelection';
import { WaitingForOpponent } from './interviewParts/WaitingForOpponent';
import { WaitingQuestionDisplay } from './interviewParts/WaitingQuestionDisplay';
import { InterviewStatus, InterviewOutcome, interviewReducer, initialState, InterviewPosition } from './interviewReducer';
import { useReducer, useEffect, useState } from 'react';
import { connectInterview } from './connectInterview';
import { InducerPrompt } from './interviewParts/InducerPrompt';
import { InducerResponse } from './interviewParts/InducerResponse';
import { InducerDisplay } from './interviewParts/InducerDisplay';
import { PositionSelection } from './interviewParts/PositionSelection';
import { WaitPenalty } from './interviewParts/WaitPenalty';
import { SpectatorPenaltySelection } from './interviewParts/SpectatorPenaltySelection';
import { SpectatorInducerDisplay } from './interviewParts/SpectatorInducerDisplay';
import { SpectatorBackgroundSelection } from './interviewParts/SpectatorBackgroundSelection';
import { SpectatorReadyToStart } from './interviewParts/SpectatorReadyToStart';
import { SpectatorInProgress } from './interviewParts/SpectatorInProgress';

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
        [props.match.params.id]
    );

    switch (state.status) {
        case InterviewStatus.InvalidSession:
            return <Redirect to="/" />

        case InterviewStatus.NotConnected:
            return <NotYetConnected />

        case InterviewStatus.Disconnected:
            return <Disconnected />

        case InterviewStatus.WaitingForOpponent:
            return <WaitingForOpponent interviewID={props.match.params.id} />

        case InterviewStatus.SelectingPositions:
            switch (state.position) {
                case InterviewPosition.Interviewer:
                    const confirm = () => connection!.invoke('ConfirmPositions');
                    const swap = () => connection!.invoke('SwapPositions');

                    return <InterviewerPositionSelection stay={confirm} swap={swap} />
                case InterviewPosition.Suspect:
                case InterviewPosition.Spectator:
                    return <PositionSelection position={state.position} />
            }
            break;

        case InterviewStatus.PenaltySelection:
            if (state.position === InterviewPosition.Spectator)
                return <SpectatorPenaltySelection options={state.choice} turn={state.turn} />

            if (state.choice.length > 0) {
                const selectPenalty = (index: number) => connection!.invoke('Select', index);

                return state.position === InterviewPosition.Interviewer
                    ? <InterviewerPenaltySelection options={state.choice} action={selectPenalty} />
                    : <SuspectPenaltySelection options={state.choice} action={selectPenalty} />
            }
            
            return <WaitPenalty position={state.position} />

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
                ? <PacketSelection options={state.packets!} action={selectPacket} />
                : <WaitPacketSelection position={state.position} />

        case InterviewStatus.InducerPrompt:
            const administer = () => connection?.invoke('Select', 0);

            switch (state.position) {
                case InterviewPosition.Interviewer:
                    return <InducerPrompt
                        solution={state.patternSolution!}
                        packet={state.packet}
                        continue={administer}
                    />

                case InterviewPosition.Suspect:
                    return <InducerWait
                        position={state.position}
                        packet={state.packet}
                    />

                case InterviewPosition.Spectator:
                    return <SpectatorInducerDisplay
                        position={state.position}
                        packet={state.packet}
                        role={state.role!}
                        connections={state.patternConnections}
                        content={state.patternContent}
                        solution={state.patternSolution}
                    />
            }
            break;

        case InterviewStatus.ShowingInducer:
            const correctResponse = () => connection!.invoke('Select', 0);
            const incorrectResponse = () => connection!.invoke('Select', 1);

            switch (state.position) {
                case InterviewPosition.Interviewer:
                    return <InducerResponse
                        solution={state.patternSolution!}
                        packet={state.packet}
                        correct={correctResponse}
                        incorrect={incorrectResponse}
                    />

                case InterviewPosition.Suspect:
                    return <InducerDisplay
                        position={state.position}
                        packet={state.packet}
                        role={state.role!}
                        connections={state.patternConnections}
                        content={state.patternContent}
                        solution={state.patternSolution}
                    />

                case InterviewPosition.Spectator:
                    return <SpectatorInducerDisplay
                        position={state.position}
                        packet={state.packet}
                        role={state.role!}
                        connections={state.patternConnections}
                        content={state.patternContent}
                        solution={state.patternSolution}
                    />
            }
            break;

        case InterviewStatus.BackgroundSelection:
            switch (state.position) {
                case InterviewPosition.Interviewer:
                    return <WaitingQuestionDisplay
                        questions={state.questions}
                        sortQuestions={questions => dispatch({
                            type: 'set questions',
                            questions,
                        })}
                    />

                case InterviewPosition.Suspect:
                    const selectBackground = (index: number) => connection!.invoke('Select', index);
                    return <SuspectBackgroundSelection options={state.choice} role={state.role!} action={selectBackground} />

                case InterviewPosition.Spectator:
                    return <SpectatorBackgroundSelection options={state.choice} role={state.role!}/>
            }
            break;

        case InterviewStatus.ReadyToStart:
            switch (state.position) {
                case InterviewPosition.Interviewer:
                    const ready = () => connection!.invoke('StartInterview');
                    return (
                        <InterviewerReadyToStart
                            questions={state.questions}
                            prompt={state.prompt}
                            suspectBackground={state.suspectBackground}
                            penalty={state.penalty}
                            ready={ready}
                            sortQuestions={questions => dispatch({
                                type: 'set questions',
                                questions,
                            })}
                        />
                    );

                case InterviewPosition.Suspect:
                    return (
                        <SuspectReadyToStart
                            role={state.role!}
                            suspectBackground={state.suspectBackground}
                            penalty={state.penalty}
                        />
                    );

                case InterviewPosition.Spectator:
                    return (
                        <SpectatorReadyToStart
                            role={state.role!}
                            suspectBackground={state.suspectBackground}
                            penalty={state.penalty}
                        />
                    );
            }
            break;

        case InterviewStatus.InProgress:
            switch (state.position) {
                case InterviewPosition.Interviewer:
                    const conclude = (isRobot: boolean) => connection!.invoke('ConcludeInterview', isRobot);
                    return (
                        <InterviewerInProgress
                            conclude={conclude}
                            duration={state.duration}
                            penalty={state.penalty}
                            questions={state.questions}
                            suspectBackground={state.suspectBackground}
                        />
                    );

                case InterviewPosition.Suspect:
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

                case InterviewPosition.Spectator:
                    return (
                        <SpectatorInProgress
                            duration={state.duration}
                            penalty={state.penalty}
                            role={state.role!}
                            suspectBackground={state.suspectBackground}
                        />
                    );
            }

        case InterviewStatus.Finished:
            if (state.outcome! === InterviewOutcome.Disconnected) {
                return <OpponentDisconnected />
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
    
            break;
        }
        
        return <div>Unknown status</div>
}
