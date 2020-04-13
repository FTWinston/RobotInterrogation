import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Container, Typography, ButtonGroup, Button, makeStyles } from '@material-ui/core';
import { Help } from './elements/Help';

interface IProps {
    stay: () => void,
    swap: () => void,
}

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export const InterviewerPositionSelection: React.FunctionComponent<IProps> = props => {
    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <PositionHeader position={InterviewPosition.Interviewer} />

            <Typography paragraph>
                Please select your <Help entry="positions">positions</Help> for this interview:
            </Typography>

            <div className={classes.root}>
                <ButtonGroup orientation="vertical">
                    <Button onClick={props.stay}>Remain as the Interviewer</Button>
                    <Button onClick={props.swap}>Switch roles and become the Suspect</Button>
                </ButtonGroup>
            </div>
        </Container>
    );
}