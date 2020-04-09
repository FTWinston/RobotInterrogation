import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';
import { PacketDisplay } from './elements/PacketDisplay';

interface IProps {
    position: InterviewPosition;
    packet: string;
}

export const InducerWait: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={props.position} />

            <PacketDisplay packet={props.packet} />

            <p>The interviewer will shortly ask you a question, and then administer the inducer.</p>
            <p>You will see your role for this interview, and an inteference task.</p>
            <p>Answer the interviewer's question correctly to be able to choose your background.</p>
        </div>
    )
}