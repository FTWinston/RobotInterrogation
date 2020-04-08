import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';

interface IProps {
    position: InterviewPosition;
    penalty: string;
}

export const PenaltyCalibration: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={props.position} />

            <p>The chosen penality is:</p>
            <p className="valueDisplay">{props.penalty}</p>
        </div>
    )
}