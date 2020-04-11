import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';

interface IProps {
    position: InterviewPosition;
}

export const PositionSelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={props.position} />
            <p>Wait for the Interviewer to confirm your respective roles.</p>
            
            <p>The Interviewer must try to determine whether the Suspect is a human or a robot.</p>
                
            <p>The Suspect should try to convince the Interviewer that they are human.</p>
        </div>
    );
}