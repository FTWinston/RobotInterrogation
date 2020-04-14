import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import { ActionSet } from './interviewParts/elements/ActionSet';
import { Page } from './interviewParts/elements/Page';
import { P } from './interviewParts/elements/P';

export const Home: React.FunctionComponent = () => {
    return (
        <Page>
            <Typography variant="h2" gutterBottom>Robot Interrogation</Typography>

            <P>Can you tell if someone is secretly a robot?</P>

            <P>Play with a friend over video chat, or in the same room.</P>

            <ActionSet>
                <Button variant="outlined" component={Link} to="/about">Information</Button>
                <Button variant="outlined" color="primary" component={Link} to="/host">Start a game</Button>
            </ActionSet>
        </Page>
    );
}
