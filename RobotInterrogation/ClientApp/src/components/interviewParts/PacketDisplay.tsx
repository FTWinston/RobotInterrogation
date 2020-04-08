import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';

interface IProps {
    position: InterviewPosition;
    packet: string;
}

export const PacketDisplay: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={props.position} />

            <p>The chosen interview packet is:</p>
            <p className="valueDisplay">{props.packet}</p>
        </div>
    )
}