import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const SuspectPenaltySelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the suspect.</h2>
            <p>Select one of the following penalities to <strong>use</strong> for this interview.</p>

            {renderOptions(props.options, props.action)}
        </div>
    );
}