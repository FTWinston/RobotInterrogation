import React from 'react';
import { InterviewPosition } from '../../interviewReducer';
import { Typography } from '@material-ui/core';

interface Props {
    position: InterviewPosition
}

export const PositionHeader: React.FC<Props> = props => {
    return <Typography variant="h4" gutterBottom>{getText(props.position)}</Typography>
}

function getText(position: InterviewPosition) {
    switch (position) {
        case InterviewPosition.Interviewer:
            return 'You are the interviewer';
        case InterviewPosition.Suspect:
            return 'You are the suspect';
        default:
            return 'You are a spectator';
    }
}
