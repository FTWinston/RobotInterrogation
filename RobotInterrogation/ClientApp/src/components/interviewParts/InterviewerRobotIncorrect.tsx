import * as React from 'react';

export class InterviewerRobotIncorrect extends React.PureComponent {
    public render() {
        return <div>
            <p className="lead">You wrongly identified the suspect as a robot. They are actually human.</p>
            <p>You both lose.</p>
        </div>
    }
}