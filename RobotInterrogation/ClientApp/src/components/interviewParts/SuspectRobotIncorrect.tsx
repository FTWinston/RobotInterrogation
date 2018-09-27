import * as React from 'react';

export class SuspectRobotIncorrect extends React.PureComponent {
    public render() {
        return <div>
            <h2>You are the suspect.</h2>
            <p>The interviewer wrongly identified you as a robot.</p>
            <p>You both lose.</p>
        </div>
    }
}