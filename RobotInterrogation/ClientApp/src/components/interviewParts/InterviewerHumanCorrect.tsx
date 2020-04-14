import * as React from 'react';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';

export const InterviewerHumanCorrect: React.FunctionComponent = () => {
    return (
        <Page>
            <P>You correctly identified the suspect as a human.</P>
            <Typography variant="h4">You both win.</Typography>
        </Page>
    );
}