import * as React from 'react';
import { renderOptions } from './renderOptions';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { ActionSet } from './elements/ActionSet';

interface IProps {
    options: string[],
    role: ISuspectRole;
    action: (index: number) => void,
}

export const SuspectBackgroundSelection: React.FunctionComponent<IProps> = props => {
    const message = props.options.length === 1
        ? <p>You failed. You can only choose the following background:</p>
        : <p>You succeeded. Select one of the following backgrounds:</p>

    const options = props.options.length === 1
        ? (
            <ActionSet>
                <button onClick={() => props.action(0)}>{props.options[0]}</button>
            </ActionSet>
        )
        : renderOptions(props.options, props.action)

    return (
        <div>
            <PositionHeader position={InterviewPosition.Suspect} />

            <SuspectRole role={props.role} />

            {message}

            {options}
        </div>
    );
}