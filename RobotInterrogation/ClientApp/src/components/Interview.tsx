import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { connectSignalR } from '../Connectivity';
import { Disconnected } from './interviewParts/Disconnected';
import { IInterviewQuestion } from './interviewParts/elements/InterviewQuestion';
import { ISuspectRole } from './interviewParts/elements/SuspectRole';
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
import { RoleSelection } from './interviewParts/RoleSelection';
import { SuspectInProgress } from './interviewParts/SuspectInProgress';
import { SuspectNoteSelection } from './interviewParts/SuspectNoteSelection';
import { SuspectPenaltySelection } from './interviewParts/SuspectPenaltySelection';
import { SuspectReadyToStart } from './interviewParts/SuspectReadyToStart';
import { Wait } from './interviewParts/Wait';
import { WaitingForOpponent } from './interviewParts/WaitingForOpponent';
import { WaitingQuestionDisplay } from './interviewParts/WaitingQuestionDisplay';

export const enum InterviewStatus {
    NotConnected,
    Disconnected,
    InvalidSession,
    WaitingForOpponent,

    SelectingPositions,
    RoleConfirmed,

    PenaltySelection,
    ShowingPenalty,

    PacketSelection,
    ShowingPacket,

    RoleSelection,
    SuspectNoteSelection,

    ReadyToStart,
    InProgress,

    Finished,
}

export const enum InterviewOutcome {
    Disconnected = 0,
    CorrectlyGuessedHuman,
    WronglyGuessedHuman,
    CorrectlyGuessedRobot,
    WronglyGuessedRobot,
    KilledInterviewer,
}

interface IState {
    isInterviewer: boolean;
    status: InterviewStatus;
    outcome?: InterviewOutcome;
    choice: string[];
    packet: string;
    penalty: string;
    primaryQuestions: IInterviewQuestion[];
    secondaryQuestions: IInterviewQuestion[];
    suspectNote: string;
    role?: ISuspectRole;
    roles: ISuspectRole[];
    duration: number;
}

export class Interview extends React.PureComponent<RouteComponentProps<{ id: string }>, IState> {
    private connection: signalR.HubConnection;

    constructor(props: RouteComponentProps<{ id: string }>) {
        super(props);

        this.state = {
            choice: [],
            duration: 0,
            isInterviewer: false,
            packet: '',
            penalty: '',
            primaryQuestions: [],
            roles: [],
            secondaryQuestions: [],
            status: InterviewStatus.NotConnected,
            suspectNote: '',
        };
    }

    public render() {
        switch (this.state.status) {
            case InterviewStatus.InvalidSession:
                return <Redirect to="/" />;

            case InterviewStatus.NotConnected:
                return <NotYetConnected />;

            case InterviewStatus.Disconnected:
                return <Disconnected />;

            case InterviewStatus.WaitingForOpponent:
                return <WaitingForOpponent interviewID={this.props.match.params.id} />;

            case InterviewStatus.SelectingPositions:
                if (this.state.isInterviewer) {
                    const confirm = () => this.connection.invoke('ConfirmPositions');
                    const swap = () => this.connection.invoke('SwapPositions');

                    return <InterviewerPositionSelection stay={confirm} swap={swap} />;
                }
                else {
                    return <Wait role="suspect" waitFor="the interviewer to confirm your respective roles" />;
                }

            case InterviewStatus.PenaltySelection:
                if (this.state.choice.length > 0) {
                    const selectPenalty = (index: number) => this.connection.invoke('Select', index);

                    return this.state.isInterviewer
                        ? <InterviewerPenaltySelection options={this.state.choice} action={selectPenalty} />
                        : <SuspectPenaltySelection options={this.state.choice} action={selectPenalty} />
                }
                else {
                    return this.state.isInterviewer
                        ? <Wait role="interviewer" waitFor="the suspect to choose a penalty" />
                        : <Wait role="suspect" waitFor="the interviewer to discard a penalty" />;
                }

            case InterviewStatus.ShowingPenalty:
                return <PenaltyDisplay role={this.state.isInterviewer ? 'interviewer' : 'suspect'} penalty={this.state.penalty} />;

            case InterviewStatus.PacketSelection:
                const selectPacket = (index: number) => this.connection.invoke('Select', index);

                return this.state.isInterviewer
                    ? <PacketSelection options={this.state.choice} action={selectPacket} />
                    : <Wait role="suspect" waitFor="the interviewer select an interview packet" />;

            case InterviewStatus.ShowingPacket:
                return <PacketDisplay role={this.state.isInterviewer ? 'interviewer' : 'suspect'} packet={this.state.packet} />;

            case InterviewStatus.RoleSelection:
                if (this.state.isInterviewer) {
                    return <WaitingQuestionDisplay
                        primary={this.state.primaryQuestions}
                        secondary={this.state.secondaryQuestions}
                        waitingFor="role"
                    />;
                }
                else {
                    const selectRole = (index: number) => {
                        this.connection.invoke('Select', index);
                        this.setState({
                            role: this.state.roles[index],
                            roles: [],
                        });
                    }
                    return <RoleSelection options={this.state.roles} action={selectRole} />
                }

            case InterviewStatus.SuspectNoteSelection:
                if (this.state.isInterviewer) {
                    return <WaitingQuestionDisplay
                        primary={this.state.primaryQuestions}
                        secondary={this.state.secondaryQuestions}
                        waitingFor="character note"
                    />;
                }
                else {
                    const selectNote = (index: number) => this.connection.invoke('Select', index);
                    return <SuspectNoteSelection options={this.state.choice} action={selectNote} />
                }

            case InterviewStatus.ReadyToStart:
                if (this.state.isInterviewer) {
                    const ready = () => this.connection.invoke('StartInterview');

                    return <InterviewerReadyToStart
                        primary={this.state.primaryQuestions}
                        secondary={this.state.secondaryQuestions}
                        suspectNote={this.state.suspectNote}
                        penalty={this.state.penalty}
                        ready={ready}
                    />
                }
                else {
                    return <SuspectReadyToStart
                        role={this.state.role!}
                        suspectNote={this.state.suspectNote}
                        penalty={this.state.penalty}
                    />
                }

            case InterviewStatus.InProgress:
                if (this.state.isInterviewer) {
                    const conclude = (isRobot: boolean) => this.connection.invoke('ConcludeInterview', isRobot);

                    return <InterviewerInProgress
                        conclude={conclude}
                        duration={this.state.duration}
                        penalty={this.state.penalty}
                        primary={this.state.primaryQuestions}
                        secondary={this.state.secondaryQuestions}
                        suspectNote={this.state.suspectNote}
                    />
                }
                else {
                    const terminate = () => this.connection.invoke('KillInterviewer');

                    return <SuspectInProgress
                        duration={this.state.duration}
                        penalty={this.state.penalty}
                        role={this.state.role!}
                        suspectNote={this.state.suspectNote}
                        terminateInterviewer={terminate}
                    />
                }

            case InterviewStatus.Finished:
                if (this.state.outcome! === InterviewOutcome.Disconnected) {
                    return <OpponentDisconnected />;
                }

                const playAgain = () => this.connection.invoke('NewInterview');

                return <InterviewFinished
                    isInterviewer={this.state.isInterviewer}
                    role={this.state.role!}
                    outcome={this.state.outcome!}
                    playAgain={playAgain}
                />

            default:
                return <div>Unknown status</div>;
        }
    }

    public componentWillMount() {
        this.connect();
    }

    private async connect() {
        this.connection = connectSignalR('/hub/Interview');

        this.connection.on('SetRole', (isInterviewer: boolean) => {
            this.setState({
                isInterviewer,
            });
        });

        this.connection.on('SetWaitingForPlayer', () => {
            this.setState({
                status: InterviewStatus.WaitingForOpponent,
            });
        });

        this.connection.on('SetPlayersPresent', () => {
            this.setState({
                // clear any data from previous game
                choice: [],
                duration: 0,
                outcome: undefined,
                packet: '',
                penalty: '',
                primaryQuestions: [],
                role: undefined,
                roles: [],
                secondaryQuestions: [],
                status: InterviewStatus.SelectingPositions,
                suspectNote: '',
            });
        });

        this.connection.on('SwapPositions', () => {
            this.setState(state => {
                return {
                    isInterviewer: !state.isInterviewer,
                }
            });
        });

        this.connection.on('ShowPenaltyChoice', (options: string[]) => {
            this.setState({
                choice: options,
                status: InterviewStatus.PenaltySelection,
            });
        });

        this.connection.on('WaitForPenaltyChoice', () => {
            this.setState({
                choice: [],
                status: InterviewStatus.PenaltySelection,
            });
        });

        this.connection.on('SetPenalty', (penalty: string) => {
            this.setState({
                choice: [],
                penalty,
                status: InterviewStatus.ShowingPenalty,
            });
        });

        this.connection.on('ShowPacketChoice', (options: string[]) => {
            this.setState({
                choice: options,
                status: InterviewStatus.PacketSelection,
            });
        });

        this.connection.on('WaitForPacketChoice', () => {
            this.setState({
                choice: [],
                status: InterviewStatus.PacketSelection,
            });
        });

        this.connection.on('SetPacket', (packet: string) => {
            this.setState({
                packet,
                status: InterviewStatus.ShowingPacket,
            });
        });

        this.connection.on('ShowRoleSelection', (options: ISuspectRole[]) => {
            this.setState({
                roles: options,
                status: InterviewStatus.RoleSelection, 
            });
        });

        this.connection.on('ShowQuestions', (primary: IInterviewQuestion[], secondary: IInterviewQuestion[]) => {
            this.setState({
                primaryQuestions: primary,
                secondaryQuestions: secondary,
                status: InterviewStatus.RoleSelection,
            });
        });

        this.connection.on('ShowSuspectNoteChoice', (options: string[]) => {
            this.setState({
                choice: options,
                status: InterviewStatus.SuspectNoteSelection,
            });
        });

        this.connection.on('WaitForSuspectNoteChoice', () => {
            this.setState({
                choice: [],
                status: InterviewStatus.SuspectNoteSelection,
            });
        });

        this.connection.on('SetSuspectNote', (note: string) => {
            this.setState({
                status: InterviewStatus.ReadyToStart,
                suspectNote: note,
            });
        });

        this.connection.on('StartTimer', (duration: number) => {
            this.setState({
                duration,
                status: InterviewStatus.InProgress,
            });
        })

        this.connection.on('EndGame', (outcome: InterviewOutcome, role: ISuspectRole) => {
            this.setState({
                outcome,
                role,
                status: InterviewStatus.Finished,
            });
        })

        this.connection.onclose((error?: Error) => {
            /*
            if (error !== undefined) {
                console.log('Connection error:', error);
            }
            else {
                console.log('Unspecified connection error');
            }
            */
            
            this.setState({
                status: InterviewStatus.Disconnected,
            });
        });

        await this.connection.start();

        const ok = await this.connection.invoke('Join', this.props.match.params.id)

        if (!ok) {
            this.setState({
                status: InterviewStatus.InvalidSession,
            });

            await this.connection.stop();
        }
    }
}
