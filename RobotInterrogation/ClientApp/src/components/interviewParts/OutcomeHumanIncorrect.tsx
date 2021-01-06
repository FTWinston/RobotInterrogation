import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Typography } from '@material-ui/core';
import { P } from './elements/P';
import { Page } from './elements/Page';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    position: InterviewPosition,
    role: ISuspectRole,
}

export const OutcomeHumanIncorrect: React.FunctionComponent<IProps> = props => {
    switch (props.position) {
        case InterviewPosition.Interviewer:
            let winOrLose = props.role.type === 'ViolentRobot'
                ? <Typography variant="h4">You both lose.</Typography>
                : <Typography variant="h4">You lose.</Typography>

            let extra = props.role.type === 'ViolentRobot'
                ? <P>(Violent robots cannot win by being certified as human. They only win by completing their tasks.)</P>
                : undefined;

            return (
                <Page>
                    <P>You wrongly identified the suspect as a human.<br />They are actually a robot.</P>
                    {winOrLose}
                    <SuspectRole role={props.role} />
                    {extra}
                </Page>
            );

        case InterviewPosition.Suspect:
            winOrLose = props.role.type === 'ViolentRobot'
                ? <Typography variant="h4">You both lose.</Typography>
                : <Typography variant="h4">You win.</Typography>

            extra = props.role.type === 'ViolentRobot'
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

        case InterviewPosition.Spectator:
            winOrLose = props.role.type === 'ViolentRobot'
                ? <Typography variant="h4">They both lose.</Typography>
                : <Typography variant="h4">Suspect wins.</Typography>

            extra = props.role.type === 'ViolentRobot'
                ? <P>(Violent robots cannot win by being certified as human. They only win by completing their tasks.)</P>
                : undefined;

            return (
                <Page>
                    <P>The interviewer wrongly identified the suspect as a human.</P>
                    {winOrLose}
                    <SuspectRole role={props.role} />
                    {extra}
                </Page>
            );

        default:
            return <P>Unknown outcome</P>;
    }
}