import * as React from 'react';
import { renderOptions } from './renderOptions';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const PacketSelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <p>Please select an interview packet to use for this interview.</p>

            {renderOptions(props.options, props.action)}
        </div>
    )
}