import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { Container, Typography } from '@material-ui/core';

interface IProps {
    position: InterviewPosition;
}

export const PositionSelection: React.FunctionComponent<IProps> = props => {
    return (
        <Container maxWidth="sm">
            <PositionHeader position={props.position} />
            <Typography paragraph>Wait for the Interviewer to confirm your respective roles.</Typography>
        </Container>
    );
}