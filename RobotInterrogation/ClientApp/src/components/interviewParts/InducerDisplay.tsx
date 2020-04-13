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

export const InducerDisplay: React.FunctionComponent<IProps> = props => {
    const patternOrSolution = props.solution !== undefined
        ? <InterferenceSolution solution={props.solution} />
        : props.connections !== undefined && props.content !== undefined
            ? <InterferencePattern connections={props.connections} content={props.content} />
            : undefined;

    return (
        <Page>
            <PositionHeader position={props.position} />

            <PacketDisplay packet={props.packet} />

            <Typography>The <Help entry="inducer">inducer</Help> has been administered. Your <Help entry="roles">role</Help>:</Typography>
            <SuspectRole role={props.role} />

            {patternOrSolution}

            <P>Answer the Interviewer's question based on the above diagram.<br/>If you answer correctly, you can choose your <Help entry="background">background</Help>.</P>
        </Page>
    )
}