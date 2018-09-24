import * as signalR from '@aspnet/signalr';
import * as React from 'react';

export class Interview extends React.PureComponent {
    public render() {
        return <div>
            Not yet functional...
        </div>;
    }

    public componentWillMount() {
        this.connectSignalR();
    }

    private connectSignalR() {
        return new signalR.HubConnectionBuilder()
            .withUrl(`http://${document.location.host}/hub/Interview`)
            .build();
    }
}
