import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    role: ISuspectRole;
}

export const SuspectRobotCorrect: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Suspect} />
            <p>The interviewer correctly identified you as a robot.</p>
            <p>You lose.</p>

            <SuspectRole role={props.role} />
        </div>
    );
}