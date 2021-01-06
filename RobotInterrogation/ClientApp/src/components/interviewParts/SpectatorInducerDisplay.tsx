import * as React from 'react';
import { InterviewPosition, Direction } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { InterferenceSolution } from './elements/InterferenceSolution';
import { InterferencePattern } from './elements/InterferencePattern';
import { PacketDisplay } from './elements/PacketDisplay';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Typography } from '@material-ui/core';
import { Help } from './elements/Help';

interface IProps {
    position: InterviewPosition;
    packet: string;
    role: ISuspectRole;
    connections?: Direction[][];
    content?: string[][];
    solution?: string[];
}

export const SpectatorInducerDisplay: React.FunctionComponent<IProps> = props => {

    return (
        <Page>
            <PositionHeader position={props.position} />

            <PacketDisplay packet={props.packet} />

            <Typography>The <Help entry="inducer">inducer</Help> has been administered. Suspect's <Help entry="roles">role</Help>:</Typography>
            <SuspectRole role={props.role} />

            {props.solution ? <InterferenceSolution solution={props.solution} /> : undefined}
            {props.connections !== undefined && props.content !== undefined ? <InterferencePattern connections={props.connections} content={props.content} /> : undefined}

            <P>The Suspect will now answer the Interviewer's question.<br />If answered correctly, the Suspect will get to choose their <Help entry="background">background</Help>.</P>
        </Page>
    )
}