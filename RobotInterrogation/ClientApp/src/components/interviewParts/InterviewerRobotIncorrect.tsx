import * as React from 'react';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';

export const InterviewerRobotIncorrect: React.FunctionComponent = () => {
    return (
        <Page>
            <P>You wrongly identified the suspect as a robot. They are actually human.</P>
            <Typography variant="h4">You both lose.</Typography>
        </Page>
    );
}