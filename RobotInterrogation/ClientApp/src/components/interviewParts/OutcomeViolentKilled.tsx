import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    position: InterviewPosition;
    role: ISuspectRole;
}

export const OutcomeViolentKilled: React.FunctionComponent<IProps> = props => {
    switch (props.position) {
        case InterviewPosition.Interviewer:
            return (
                <Page>
                    <P>The suspect was a violent robot who completed their obsession and killed you.</P>
                    <Typography variant="h4">You lose.</Typography>

                    <SuspectRole role={props.role} />
                </Page>
            );

        case InterviewPosition.Suspect:
            return (
                <Page>
                    <P>You completed your obsession and killed the Interviewer.</P>
                    <Typography variant="h4">You win.</Typography>

                    <SuspectRole role={props.role} />
                </Page>
            );

        default:
            return (
                <Page>
                    <P>Suspect completed their obsession and killed the Interviewer.</P>
                    <Typography variant="h4">Suspect wins.</Typography>

                    <SuspectRole role={props.role} />
                </Page>
            );
    }
}