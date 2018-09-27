import * as React from 'react';

export class SuspectHumanCorrect extends React.PureComponent {
    public render() {
        return <div>
            <h2>You are the suspect.</h2>
            <p>The interviewer correctly identified you as a human.</p>
            <p>You both win.</p>
        </div>
    }
}