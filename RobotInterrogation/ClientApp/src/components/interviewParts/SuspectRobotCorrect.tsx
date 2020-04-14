import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';

interface IProps {
    role: ISuspectRole;
}

export const SuspectRobotCorrect: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <P>The Interviewer correctly identified you as a robot.</P>
            <Typography variant="h4">You lose</Typography>
            <SuspectRole role={props.role} />
        </Page>
    );
}