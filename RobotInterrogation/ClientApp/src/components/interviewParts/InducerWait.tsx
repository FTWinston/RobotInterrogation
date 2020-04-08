import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';

interface IProps {
    position: InterviewPosition;
    packet: string;
}

export const InducerWait: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={props.position} />

            <p>The chosen interview packet is:</p>
            <p className="valueDisplay">{props.packet}</p>

            <p>
                The interviewer will shortly ask you a question, and then administer the inducer.
                <br/>You will see your role for this interview, and an inteference task.
                <br/>Answer the interviewer's question correctly to be able to choose your background.
            </p>
        </div>
    )
}