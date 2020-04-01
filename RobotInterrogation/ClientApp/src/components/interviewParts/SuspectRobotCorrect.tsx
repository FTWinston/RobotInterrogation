import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const SuspectRobotCorrect: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the suspect.</h2>
            <p>The interviewer correctly identified you as a robot.</p>
            <p>You lose.</p>

            <SuspectRole role={props.role} />
        </div>
    );
}