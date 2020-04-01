import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const InterviewerHumanIncorrect: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <p>You wrongly identified the suspect as a human.<br/>They are acutally a robot.</p>
            <h2>You lose.</h2>

            <SuspectRole role={props.role} />
        </div>
    );
}