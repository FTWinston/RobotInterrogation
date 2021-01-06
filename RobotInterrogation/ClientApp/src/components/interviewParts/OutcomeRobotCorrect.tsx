import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    position: InterviewPosition,
    role: ISuspectRole,
}

export const OutcomeRobotCorrect: React.FunctionComponent<IProps> = (props) => {
    switch (props.position) {
        case InterviewPosition.Interviewer:
            return (
                <Page>
                    <P>You correctly identified the suspect as a robot.</P>
                    <Typography variant="h4">You win.</Typography>
                    <SuspectRole role={props.role} />
                </Page>
            );

        case InterviewPosition.Suspect:
            return (
                <Page>
                    <P>The Interviewer correctly identified you as a robot.</P>
                    <Typography variant="h4">You lose.</Typography>
                    <SuspectRole role={props.role} />
                </Page>
            );

        case InterviewPosition.Spectator:
            return (
                <Page>
                    <P>The Interviewer correctly identified the suspect as a robot.</P>
                    <Typography variant="h4">Interviewer wins.</Typography>
                    <SuspectRole role={props.role} />
                </Page>
            );

        default:
            return <P>Unknown outcome</P>;
    }
}