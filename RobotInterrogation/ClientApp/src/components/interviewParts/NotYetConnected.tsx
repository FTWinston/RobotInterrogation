import * as React from 'react';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';

export const NotYetConnected: React.FunctionComponent = () => {
    return (
        <Page>
            <Typography variant="h4" gutterBottom />
            <P>Connecting...</P>
        </Page>
    );
}