import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Button } from '@material-ui/core';
import { Help } from './elements/Help';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Choice } from './elements/Choice';

interface IProps {
    stay: () => void,
    swap: () => void,
}

export const InterviewerPositionSelection: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <P>
                Select your <Help entry="positions">position</Help> for this interview:
            </P>

            <Choice>
                <Button onClick={props.stay}>Remain as the Interviewer</Button>
                <Button onClick={props.swap}>Switch positions and become the Suspect</Button>
            </Choice>
        </Page>
    );
}