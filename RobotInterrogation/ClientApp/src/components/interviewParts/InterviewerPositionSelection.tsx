import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    stay: () => void,
    swap: () => void,
}

export const InterviewerPositionSelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <p>Please select an option:</p>

            <button onClick={props.stay}>Remain as the Interviewer</button>
            <br />
            <button onClick={props.swap}>Switch roles and become the Suspect</button>

            <p>The Interviewer must try to determine whether the Suspect is a human or a robot.</p>
                
            <p>The Suspect should try to convince the Interviewer that they are human.</p>
        </div>
    );
}