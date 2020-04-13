import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';
import { ActionSet } from './elements/ActionSet';

interface IProps {
    position: InterviewPosition;
    penalty: string;
    confirm?: () => void;
}

export const PenaltyCalibration: React.FunctionComponent<IProps> = props => {
    const extraMessage = props.position === InterviewPosition.Interviewer
        ? <p>Ask the Suspect to perform this penalty 3 times.<br/>When you are satisfied that they have done so, click to continue.</p>
        : <p>The Interviewer will now ask you to perform this penalty 3 times.</p>

    const confirm = props.confirm
        ? <ActionSet><button onClick={() => props.confirm!()}>Continue</button></ActionSet>
        : undefined;

    return (
        <div>
            <PositionHeader position={props.position} />

            <p>The chosen penalty is:</p>
            <p className="valueDisplay">{props.penalty}</p>

            {extraMessage}
            {confirm}
        </div>
    )
}