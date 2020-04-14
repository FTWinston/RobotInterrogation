import * as React from 'react';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';

export const SuspectHumanCorrect: React.FunctionComponent = () => {
    return (
        <Page>
            <P>The interviewer correctly identified you as a human.</P>
            <Typography variant="h4">You both win.</Typography>
        </Page>
    );
}