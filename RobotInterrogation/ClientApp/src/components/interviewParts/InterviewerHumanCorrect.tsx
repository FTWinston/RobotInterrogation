import * as React from 'react';

export class InterviewerHumanCorrect extends React.PureComponent {
    public render() {
        return <div>
            <p className="lead">You correctly identified the suspect as a human.</p>
            <p>You both win.</p>
        </div>
    }
}