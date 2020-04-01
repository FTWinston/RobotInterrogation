import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const SuspectHumanIncorrect: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <p>The interviewer wrongly identified you as a human.</p>
            <h2>You win.</h2>

            <SuspectRole role={props.role} />
        </div>
    );
}