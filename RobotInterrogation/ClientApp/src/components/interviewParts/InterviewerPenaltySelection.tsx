import * as React from 'react';
import { renderOptions } from './renderOptions';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const InterviewerPenaltySelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <p>Select one of the following penalities to <strong>discard</strong>. The suspect will choose from the remaining two.</p>

            {renderOptions(props.options, props.action)}
        </div>
    );
}