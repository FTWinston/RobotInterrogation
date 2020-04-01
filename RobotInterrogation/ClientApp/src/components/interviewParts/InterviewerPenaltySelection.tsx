import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const InterviewerPenaltySelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the interviewer.</h2>
            <p>Select one of the following penalities to <strong>discard</strong>. The suspect will choose from the remaining two.</p>

            {renderOptions(props.options, props.action)}
        </div>
    );
}