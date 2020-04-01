import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const InterviewerViolentKilled: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <p>The suspect was a violent robot who completed their obsession and killed you.</p>
            <h2>You lose.</h2>

            <SuspectRole role={props.role} />
        </div>
    );
}