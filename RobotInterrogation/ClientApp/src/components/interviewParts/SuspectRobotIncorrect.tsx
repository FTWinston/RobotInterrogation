import * as React from 'react';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';

export const SuspectRobotIncorrect: React.FunctionComponent = () => {
    return (
        <Page>
            <P>The Interviewer wrongly identified you as a robot.</P>
            <Typography variant="h4">You both lose.</Typography>
        </Page>
    );
}