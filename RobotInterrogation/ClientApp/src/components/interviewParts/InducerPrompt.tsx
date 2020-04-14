import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { InterferenceSolution } from './elements/InterferenceSolution';
import { PacketDisplay } from './elements/PacketDisplay';
import { ActionSet } from './elements/ActionSet';
import { Help } from './elements/Help';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Button, Typography } from '@material-ui/core';

interface IProps {
    solution: string[];
    packet: string;
    continue: () => void;
}

export const InducerPrompt: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <PacketDisplay packet={props.packet} />

            <P>Ask the Suspect a question based on the sequence below, then click below to administer the <Help entry="inducer">inducer</Help>, revealing the Suspect's <Help entry="roles">role</Help> to them.</P>
            
            <InterferenceSolution solution={props.solution} />

            <Typography component="div">
                Example questions:
                <ul>
                    <li>What letters come between A and D?</li>
                    <li>What letter follows B?</li>
                </ul>
            </Typography>
            
            <ActionSet>
                <Button variant="outlined" onClick={() => props.continue()}>Continue</Button>
            </ActionSet>
        </Page>
    )
}