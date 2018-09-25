import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { connectSignalR } from '../Connectivity';

const enum InterviewStatus {
    NotConnected,
    Disconnected,
    InvalidSession,
    WaitingForOpponent,

    SelectingPositions,
    RoleConfirmed,

    PenaltySelection,
    ShowingPenalty,
}

interface IState {
    isInterviewer: boolean;
    status: InterviewStatus;
    choice: string[];
    penalty: string;
}

export class Interview extends React.PureComponent<RouteComponentProps<{ id: string }>, IState> {
    private connection: signalR.HubConnection;

    constructor(props: RouteComponentProps<{ id: string }>) {
        super(props);

        this.state = {
            choice: [],
            isInterviewer: false,
            penalty: '',
            status: InterviewStatus.NotConnected,
        };
    }

    public render() {
        switch (this.state.status) {
            case InterviewStatus.InvalidSession:
                return renderInvalidSession();

            case InterviewStatus.NotConnected:
                return renderNotConnected();

            case InterviewStatus.Disconnected:
                return renderDisconnected();

            case InterviewStatus.WaitingForOpponent:
                return <div>Waiting for other player to join interview {this.props.match.params.id}</div>;

            case InterviewStatus.SelectingPositions:
                if (this.state.isInterviewer) {
                    const confirm = () => this.connection.invoke('ConfirmPositions');
                    const swap = () => this.connection.invoke('SwapPositions');

                    return <InterviewerPositionSelection stay={confirm} swap={swap} />;
                }
                else {
                    return renderSuspectPositionSelection();
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
                        ? renderInterviewerPenaltySelection()
                        : renderSuspectPenaltySelection();
                }

            case InterviewStatus.ShowingPenalty:
                return <PenaltyDisplay role={this.state.isInterviewer ? 'interviewer' : 'suspect'} penalty={this.state.penalty} />;

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
                status: InterviewStatus.SelectingPositions,
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

        // TODO: seems like only the OTHER player sees the response here.
        // Is the problem that we're awaiting, or that this is too soon, or what?
        const ok = await this.connection.invoke('Join', this.props.match.params.id)

        if (!ok) {
            this.setState({
                status: InterviewStatus.InvalidSession,
            });

            await this.connection.stop();
        }
    }
}

const renderInvalidSession = () => <Redirect to="/join/invalid" />;

const renderNotConnected = () => <div>You haven't yet connected.</div>;

const renderDisconnected = () => <div>You have been disconnected</div>;

class InterviewerPositionSelection extends React.PureComponent<{ stay: () => void, swap: () => void }> {
    public render() {
        return <div>
            <p className="lead">You are the interviewer.</p>

            <p>Please select an option:</p>

            <button className="btn btn-primary" onClick={this.props.stay}>Remain as the interviewer</button>
            <button className="btn btn-secondary" onClick={this.props.swap}>Switch roles and become the suspect</button>
        </div>
    }
}

const renderSuspectPositionSelection = () => <div>
    <p className="lead">You are the suspect.</p>
    <p>Please wait for the interviewer to confirm your respective roles.</p>
</div>

const renderOptions = (options: string[], action: (index: number) => void) => {
    const optionDisplay = options.map((val: string, index: number) => {
        const onClick = () => action(index);
        return <li key={index}><button className="btn" onClick={onClick}>{val}</button></li>
    });

    return <ol>{optionDisplay}</ol>
};

class InterviewerPenaltySelection extends React.PureComponent<{ options: string[], action: (index: number) => void }> {
    public render() {
        return <div>
            <p className="lead">You are the interviewer.</p>
            <p>Please select one of the following penalities to <strong>discard</strong>. The suspect will choose from the remaining two.</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}

const renderSuspectPenaltySelection = () => <div>
    <p className="lead">You are the suspect.</p>
    <p>Please wait for the interviewer to discard a penalty.</p>
</div>

class SuspectPenaltySelection extends React.PureComponent<{ options: string[], action: (index: number) => void }> {
    public render() {
        return <div>
            <p className="lead">You are the suspect.</p>
            <p>Please select one of the following penalities to <strong>use</strong> for this interview.</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}

const renderInterviewerPenaltySelection = () => <div>
    <p className="lead">You are the interviewer.</p>
    <p>Please wait for the suspect to choose a penalty.</p>
</div>

class PenaltyDisplay extends React.PureComponent<{ role: string, penalty: string }> {
    public render() {
        return <div>
            <p> You are the {this.props.role}. The chosen penality is:</p>
            <p className="text-large">{this.props.penalty}</p>
        </div>
    }
}