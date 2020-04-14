import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';

interface IProps {
    role: ISuspectRole;
}

export const InterviewerViolentKilled: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <P>The suspect was a violent robot who completed their obsession and killed you.</P>
            <Typography variant="h4">You lose</Typography>

            <SuspectRole role={props.role} />
        </Page>
    );
}