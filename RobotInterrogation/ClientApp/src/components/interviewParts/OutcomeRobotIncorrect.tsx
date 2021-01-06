import * as React from 'react';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    position: InterviewPosition;
}

export const OutcomeRobotIncorrect: React.FunctionComponent<IProps> = (props) => {
    switch (props.position) {
        case InterviewPosition.Interviewer:
            return (
                <Page>
                    <P>You wrongly identified the suspect as a robot.<br />They are actually human.</P>
                    <Typography variant="h4">You both lose.</Typography>
                </Page>
            );

        case InterviewPosition.Suspect:
            return (
                <Page>
                    <P>The Interviewer wrongly identified you as a robot.</P>
                    <Typography variant="h4">You both lose.</Typography>
                </Page>
            );

        case InterviewPosition.Spectator:
            return (
                <Page>
                    <P>The Interviewer wrongly identified the suspect as a robot.</P>
                    <Typography variant="h4">They both lose.</Typography>
                </Page>
            );

        default:
            return <P>Unknown outcome</P>;
    }
}