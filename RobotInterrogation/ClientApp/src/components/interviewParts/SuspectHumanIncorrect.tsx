import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';

interface IProps {
    role: ISuspectRole;
}

export const SuspectHumanIncorrect: React.FunctionComponent<IProps> = props => {
    const winOrLose = props.role.type === 'ViolentRobot'
        ? <Typography variant="h4">You both lose.</Typography>
        : <Typography variant="h4">You win.</Typography>

    const extra = props.role.type === 'ViolentRobot'
        ? <P>(Violent robots cannot win by being certified as human. They only win by completing their tasks.)</P>
        : undefined;

    return (
        <Page>
            <P>The interviewer wrongly identified you as a human.</P>
            {winOrLose}
            <SuspectRole role={props.role} />
            {extra}
        </Page>
    );
}