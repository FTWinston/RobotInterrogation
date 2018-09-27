import * as React from 'react';

export class InterviewerHumanCorrect extends React.PureComponent {
    public render() {
        return <div>
            <h2>You are the interviewer.</h2>
            <p>You correctly identified the suspect as a human.</p>
            <p>You both win.</p>
        </div>
    }
}