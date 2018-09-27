import * as React from 'react';

export class SuspectRobotIncorrect extends React.PureComponent {
    public render() {
        return <div>
            <p>The interviewer wrongly identified you as a robot.</p>
            <h2>You both lose.</h2>
        </div>
    }
}