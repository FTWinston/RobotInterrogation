import * as React from 'react';
import { Link } from 'react-router-dom';
import { ActionSet } from './elements/ActionSet';
import { P } from './elements/P';
import { Button, Typography } from '@material-ui/core';
import { Page } from './elements/Page';

export const Disconnected: React.FunctionComponent = () => {
    return (
        <Page>
            <Typography variant="h4" gutterBottom />
            <P>You have disconnected from the interview.</P>
            <P>Check your internet connection.</P>

            <ActionSet>
                <Button variant="outlined" component={Link} to="/">Go back</Button>
            </ActionSet>
        </Page>
    );
}