import * as React from 'react';

export class Disconnected extends React.PureComponent {
    public render() {
        return <div>
            <p className="lead">You have disconnected from the interview.</p>
            <p>Check your internet connection.</p>
        </div>
    }
}