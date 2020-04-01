import * as React from 'react';

export const InterviewerRobotIncorrect: React.FunctionComponent = () => {
    return (
        <div>
            <p>You wrongly identified the suspect as a robot. They are actually human.</p>
            <h2>You both lose.</h2>
        </div>
    );
}