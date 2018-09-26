import * as React from 'react';

export class SuspectHumanCorrect extends React.PureComponent {
    public render() {
        return <div>
            <p className="lead">The interviewer correctly identified you as a human.</p>
            <p>You both win.</p>
        </div>
    }
}