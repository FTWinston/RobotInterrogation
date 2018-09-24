import * as React from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import { connectSignalR } from '../Connectivity';

const enum InterviewStatus {
    NotConnected,
    Disconnected,
    InvalidSession,
    Connected,
    WaitingForOpponent,
    PlayersPresent,
}

interface IState {
    isInterviewer: boolean;
    status: InterviewStatus
}

export class Interview extends React.PureComponent<RouteComponentProps<{ id: string }>, IState> {
    constructor(props: RouteComponentProps<{ id: string }>) {
        super(props);

        this.state = {
            isInterviewer: false,
            status: InterviewStatus.NotConnected,
        };
    }

    public render() {
        switch (this.state.status) {
            case InterviewStatus.InvalidSession:
                return <Redirect to="/join/invalid" />;

            case InterviewStatus.NotConnected:
                return <div>You haven't yet connected</div>;

            case InterviewStatus.Connected:
                return <div>You have connected to interview {this.props.match.params.id}</div>;

            case InterviewStatus.Disconnected:
                return <div>You have been disconnected</div>;

            case InterviewStatus.WaitingForOpponent:
                return <div>Waiting for other player to join interview {this.props.match.params.id}</div>;

            case InterviewStatus.PlayersPresent:
                return <div>
                    Both players are now present in interview {this.props.match.params.id}.
                    You are the {this.state.isInterviewer ? 'interviewer' : 'suspect'}.
                </div>;

            default:
                return <div>Unknown status</div>;
        }
    }

    public componentWillMount() {
        this.connect();
    }

    private async connect() {
        const connection = connectSignalR('/hub/Interview');

        connection.on('SetRole', (isInterviewer: boolean) => {
            this.setState({
                isInterviewer,
            });
        });

        connection.on('SetWaitingForPlayer', () => {
            this.setState({
                status: InterviewStatus.WaitingForOpponent,
            });
        });

        connection.on('SetPlayersPresent', () => {
            this.setState({
                status: InterviewStatus.PlayersPresent,
            });
        });

        connection.onclose((error?: Error) => {
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

        await connection.start();

        // TODO: seems like only the OTHER player sees the response here.
        // Is the problem that we're awaiting, or that this is too soon, or what?
        const ok = await connection.invoke('Join', this.props.match.params.id)

        if (!ok) {
            this.setState({
                status: InterviewStatus.InvalidSession,
            });

            await connection.stop();
        }
        else {
            this.setState({
                status: InterviewStatus.Connected,
            });
        }
    }
}
