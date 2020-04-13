import * as React from 'react';
import { Link } from 'react-router-dom';
import { inCompatibilityMode, setCompatibilityMode } from 'src/Connectivity';
import { useState } from 'react';
import { Container, Typography, Button, Link as A, makeStyles } from '@material-ui/core';
import { ActionSet } from './interviewParts/elements/ActionSet';

const useStyles = makeStyles(theme => ({
    compatibility: {
        marginTop: '1.5em',
    },
}));

export const About: React.FunctionComponent = () => {
    const [toggle, setToggle] = useState(false);

    const toggleCompatibility = () => {
        setCompatibilityMode(!inCompatibilityMode());
        setToggle(!toggle);
    }

    const toggleText = inCompatibilityMode()
        ? 'Disable compatibility mode'
        : 'Enable compatibility mode';

    const classes = useStyles();

    return (
        <Container maxWidth="sm">
            <Typography variant="h2" gutterBottom>Robot Interrogation</Typography>

            <Typography paragraph>This game is a conversation between two players, an interviewer and a suspect. It is best played by two people in the same room, though playing via video chat also works.</Typography>

            <Typography paragraph>The suspect must convince the interviewer that they are human. The interviewer must determine whether they are a robot. Robots have strange personality quirks, but then so do humans under pressure...</Typography>

            <Typography paragraph>This site is based on <A href="https://robots.management">Inhuman Conditions</A>, a game by Tommy Manarges and Cory O'Brien whose <A href="https://www.dropbox.com/s/9ledq11mc3nd15f/Inhuman%20Conditions%20Rulebooks%20%28Public%20File%29.pdf?dl=0">rules are available here</A>. Read&nbsp;them before you play.</Typography>

            <Typography paragraph>If you're interested, you can <A href="https://github.com/FTWinston/RobotInterrogation">view the source</A> of this project on GitHub. Report any problems there.</Typography>

            <ActionSet>
                <Button variant="outlined" component={Link} to="/">Go back</Button>
            </ActionSet>

            <Typography className={classes.compatibility}>
                Connection problems?&nbsp;
                <Button color="secondary" onClick={toggleCompatibility}>{toggleText}</Button>
            </Typography>
        </Container>
    )
}
