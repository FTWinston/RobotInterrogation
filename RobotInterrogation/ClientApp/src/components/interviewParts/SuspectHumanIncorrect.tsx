import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export const SuspectHumanIncorrect: React.FunctionComponent<IProps> = props => {
    const winOrLose = props.role.type === 'ViolentRobot'
        ? <h2>You both lose.</h2>
        : <h2>You win.</h2>

    const extra = props.role.type === 'ViolentRobot'
        ? <p>(Violent robots cannot win by being certified as human. They only win by completing their tasks.)</p>
        : undefined;

    return (
        <div>
            <p>The interviewer wrongly identified you as a human.</p>
            {winOrLose}
            <SuspectRole role={props.role} />
            {extra}
        </div>
    );
}