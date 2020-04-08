import * as React from 'react';
import { renderOptions } from './renderOptions';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const SuspectPenaltySelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Suspect} />
            <p>Select one of the following penalities to <strong>use</strong> for this interview.</p>

            {renderOptions(props.options, props.action)}
        </div>
    );
}