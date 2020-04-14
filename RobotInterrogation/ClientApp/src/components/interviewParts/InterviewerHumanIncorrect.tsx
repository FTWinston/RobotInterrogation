import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Typography } from '@material-ui/core';
import { P } from './elements/P';
import { Page } from './elements/Page';

interface IProps {
    role: ISuspectRole;
}

export const InterviewerHumanIncorrect: React.FunctionComponent<IProps> = props => {
    const winOrLose = props.role.type === 'ViolentRobot'
        ? <Typography variant="h4">You both lose.</Typography>
        : <Typography variant="h4">You lose.</Typography>

    const extra = props.role.type === 'ViolentRobot'
        ? <P>(Violent robots cannot win by being certified as human. They only win by completing their tasks.)</P>
        : undefined;

    return (
        <Page>
            <P>You wrongly identified the suspect as a human.<br/>They are actually a robot.</P>
            {winOrLose}
            <SuspectRole role={props.role} />
            {extra}
        </Page>
    );
}