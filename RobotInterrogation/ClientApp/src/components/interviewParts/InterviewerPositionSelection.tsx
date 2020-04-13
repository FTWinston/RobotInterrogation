import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Container, Typography, ButtonGroup, Button, makeStyles } from '@material-ui/core';

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
                Please select an option:
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

/*
<p>The Interviewer must try to determine whether the Suspect is a human or a robot.</p>
                
<p>The Suspect should try to convince the Interviewer that they are human.</p>
*/