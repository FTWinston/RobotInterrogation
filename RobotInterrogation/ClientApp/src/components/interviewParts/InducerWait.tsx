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

            <p>The Interviewer will shortly ask you a question, and then administer the inducer.</p>
            <p>You will see your role for this interview, and a diagram you will need to answer the Interviewer's question.</p>
            <p>Robots will see the same diagram as the Interviewer, but need time to read the details of their role. Humans will need to solve a puzzle to answer the question.</p>
            <p>Answer the Interviewer's question correctly to be able to choose your background.</p>
        </div>
    )
}