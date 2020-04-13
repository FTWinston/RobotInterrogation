import * as React from 'react';
import { Link } from 'react-router-dom';
import { ActionSet } from './elements/ActionSet';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Button, Typography } from '@material-ui/core';

export const OpponentDisconnected: React.FunctionComponent = () => {
    return (
        <Page>
            <Typography variant="h4" gutterBottom />
            <P>Your opponent disconnected from the interview.</P>

            <ActionSet>
                <Button variant="outlined" component={Link} to="/">Go back</Button>
            </ActionSet>
        </Page>
    );
}