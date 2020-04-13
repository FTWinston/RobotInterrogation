import * as React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Container, Button } from '@material-ui/core';
import { ActionSet } from './interviewParts/elements/ActionSet';

export const Home: React.FunctionComponent = () => {
    return (
        <Container maxWidth="sm">
            <Typography variant="h2" gutterBottom>Robot Interrogation</Typography>
            <Typography paragraph>Can you tell if someone is secretly a robot?</Typography>

            <Typography paragraph>Play with a friend, either in the same room or via video chat.</Typography>

            <ActionSet>
                <Button variant="outlined" component={Link} to="/about">Information</Button>
                <Button variant="outlined" color="primary" component={Link} to="/host">Start a game</Button>
            </ActionSet>
        </Container>
    );
}
