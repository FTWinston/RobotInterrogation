import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const SuspectViolentKilled: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <p>You completed your obsession and killed the interviewer.</p>
            <h2>You win.</h2>

            <SuspectRole role={props.role} />
        </div>
    )
}