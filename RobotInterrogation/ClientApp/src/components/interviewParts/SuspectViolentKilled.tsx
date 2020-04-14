import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Typography } from '@material-ui/core';
import { P } from './elements/P';
import { Page } from './elements/Page';

interface IProps {
    role: ISuspectRole;
}

export const SuspectViolentKilled: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <P>You completed your obsession and killed the Interviewer.</P>
            <Typography variant="h4">You win.</Typography>

            <SuspectRole role={props.role} />
        </Page>
    )
}