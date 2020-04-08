import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { InterferenceSolution } from './elements/InterferenceSolution';
import { InterferencePattern } from './elements/InterferencePattern';

interface IProps {
    position: InterviewPosition;
    packet: string;
    role: ISuspectRole;
    pattern?: string;
    solution?: string[];
}

export const InducerDisplay: React.FunctionComponent<IProps> = props => {
    const patternOrSolution = props.solution !== undefined
        ? <InterferenceSolution solution={props.solution} />
        : props.pattern !== undefined
            ? <InterferencePattern pattern={props.pattern} />
            : undefined;

    return (
        <div>
            <PositionHeader position={props.position} />

            <p>The chosen interview packet is:</p>
            <p className="valueDisplay">{props.packet}</p>

            <SuspectRole role={props.role} />

            {patternOrSolution}

            <p>Answer the interviewer's question correctly to be able to choose your background.</p>
        </div>
    )
}