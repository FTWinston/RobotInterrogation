import * as React from 'react';
import { renderOptions } from './renderOptions';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    options: string[],
    role: ISuspectRole;
    action: (index: number) => void,
}

export const SuspectBackgroundSelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the suspect.</h2>

            <SuspectRole role={props.role} />

            <p>Select one of the following backgrounds:</p>

            {renderOptions(props.options, props.action)}
        </div>
    );
}