import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';

interface IProps {
    role: ISuspectRole;
}

export const InterviewerRobotCorrect: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <P>You correctly identified the suspect as a robot.</P>
            <Typography variant="h4">You win.</Typography>

            <SuspectRole role={props.role} />
        </Page>
    );
}