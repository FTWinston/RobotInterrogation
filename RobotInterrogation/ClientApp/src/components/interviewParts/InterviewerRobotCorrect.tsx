import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const InterviewerRobotCorrect: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <p>You correctly identified the suspect as a robot.</p>
            <h2>You win.</h2>

            <SuspectRole role={props.role} />
        </div>
    );
}