import * as React from 'react';

export class SuspectRobotIncorrect extends React.PureComponent {
    public render() {
        return <div>
            <p className="lead">The interviewer wrongly identified you as a robot.</p>
            <p>You both lose.</p>
        </div>
    }
}