import * as React from 'react';

export class InterviewerRobotIncorrect extends React.PureComponent {
    public render() {
        return <div>
            <p>You wrongly identified the suspect as a robot. They are actually human.</p>
            <h2>You both lose.</h2>
        </div>
    }
}