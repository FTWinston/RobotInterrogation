import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { InterferenceSolution } from './elements/InterferenceSolution';
import { PacketDisplay } from './elements/PacketDisplay';
import { ActionSet } from './elements/ActionSet';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Button } from '@material-ui/core';
import { Help } from './elements/Help';

interface IProps {
    solution: string[];
    packet: string;
    correct: () => void;
    incorrect: () => void;
}

export const InducerResponse: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <PacketDisplay packet={props.packet} />

            <P>The <Help entry="inducer">inducer</Help> has been administered.</P>

            <InterferenceSolution solution={props.solution} />

            <P>Wait for the Suspect to answer your question, then indicate whether their response is correct. If they are correct, they can choose their <Help entry="background">background</Help>.</P>

            <ActionSet>
                <Button variant="outlined" onClick={() => props.correct()}>Correct response</Button>
                <Button variant="outlined" onClick={() => props.incorrect()}>Incorrect response</Button>
            </ActionSet>
        </Page>
    )
}