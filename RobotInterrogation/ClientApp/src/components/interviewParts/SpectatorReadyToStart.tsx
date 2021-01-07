import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Help } from './elements/Help';

interface IProps {
    suspectBackground: string,
    penalty: string,
    role: ISuspectRole,
}

export const SpectatorReadyToStart: React.FunctionComponent<IProps> = props => {
    const robotPrompt = props.role.type === 'ViolentRobot'
        ? <P>Suspect must complete 2 of the 3 tasks listed below, <em>and then wait 10 seconds</em> before they can kill the Interviewer.</P>
        : props.role.type === 'PatientRobot'
            ? <P>Suspect must perform the penalty each time they violate their vulnerability.</P>
            : undefined;

    return (
        <Page>
            <PositionHeader position={InterviewPosition.Spectator} />
            <P>Once they start the <Help entry="timer">timer</Help>, the Interviewer will ask the suspect a series of <Help entry="questions">questions</Help> to try to determine whether they are a human or a robot.</P>

            {robotPrompt}

            <SuspectRole role={props.role} />
            
            <P><Help entry="penalty">Penalty</Help>: {props.penalty}</P>
            <P>Suspect <Help entry="background">background</Help>: {props.suspectBackground}</P>
        </Page>
    );
}