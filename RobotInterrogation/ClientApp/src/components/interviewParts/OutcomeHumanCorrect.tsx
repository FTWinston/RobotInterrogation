import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { Typography } from '@material-ui/core';
import { Page } from './elements/Page';
import { P } from './elements/P';

interface IProps {
    position: InterviewPosition;
}

export const OutcomeHumanCorrect: React.FunctionComponent<IProps> = (props) => {
    switch (props.position) {
        case InterviewPosition.Interviewer:
            return (
                <Page>
                    <P>You correctly identified the suspect as a human.</P>
                    <Typography variant="h4">You both win.</Typography>
                </Page>
            );

        case InterviewPosition.Suspect:
            return (
                <Page>
                    <P>The interviewer correctly identified you as a human.</P>
                    <Typography variant="h4">You both win.</Typography>
                </Page>
            );

        default:
            return (
                <Page>
                    <P>The interviewer correctly identified the suspect as a human.</P>
                    <Typography variant="h4">They both win.</Typography>
                </Page>
            );
    }
}