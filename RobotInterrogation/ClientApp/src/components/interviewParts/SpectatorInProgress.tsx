import * as React from 'react';
import { Countdown } from './elements/Countdown';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { useState } from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { ActionSet } from './elements/ActionSet';
import { P } from './elements/P';
import { Button } from '@material-ui/core';
import { Page } from './elements/Page';

interface IProps {
    suspectBackground: string;
    penalty: string;
    role: ISuspectRole;
    duration: number;
}

export const SpectatorInProgress: React.FunctionComponent<IProps> = props => {
    const robotPrompt = props.role.type === 'ViolentRobot'
        ? <>
            <P>Suspect must complete 2 of the 3 tasks listed below, <em>and then wait 10 seconds</em> before they can kill the Interviewer.</P>
            <P>If they cannot kill the Interviewer before finishing answering their final question, they must visibly malfunction.</P>
        </>
        : props.role.type === 'PassiveRobot'
            ? <P>Suspect must perform the penalty each time they violate their vulnerability.</P>
            : undefined;

    const [elapsed, setElapsed] = useState(false);

    const elapsedPrompt = elapsed
        ? <P>The interviewer can ask one final question.</P>
        : <P/>;

    return <Page>
        <PositionHeader position={InterviewPosition.Spectator} />
        <P>While answering the Interviewer's questions, the Suspect will try to convince them that they are human.</P>
        {robotPrompt}

        <SuspectRole role={props.role} />
        
        <P>Penalty: {props.penalty}</P>
        
        <P>Suspect background: {props.suspectBackground}</P>

        <Countdown
            duration={props.duration}
            onElapsed={() => setElapsed(true)}
        />

        {elapsedPrompt}
    </Page>
}