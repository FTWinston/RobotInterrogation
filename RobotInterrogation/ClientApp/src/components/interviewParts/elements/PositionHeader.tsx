import React from 'react';
import { InterviewPosition } from '../../interviewReducer';

interface Props {
    position: InterviewPosition
}

export const PositionHeader: React.FC<Props> = props => {
    switch (props.position) {
        case InterviewPosition.Interviewer:
            return <h2>You are the interviewer.</h2>
        case InterviewPosition.Suspect:
            return <h2>You are the suspect.</h2>
        default:
            return <h2>You are not in this interview.</h2>
    }
}