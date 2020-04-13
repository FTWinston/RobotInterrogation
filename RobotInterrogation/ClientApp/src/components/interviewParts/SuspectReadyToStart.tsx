import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Page } from './elements/Page';
import { P } from './elements/P';

interface IProps {
    suspectBackground: string,
    penalty: string,
    role: ISuspectRole,
}

export const SuspectReadyToStart: React.FunctionComponent<IProps> = props => {
    const robotPrompt = props.role.type === 'ViolentRobot'
        ? <P>You must complete 2 of the 3 tasks listed below, <em>and then wait 10 seconds</em> before you can kill the Interviewer.</P>
        : props.role.type === 'PatientRobot'
            ? <P>You must perform the penalty each time you violate your vulnerability.</P>
            : undefined;

    return (
        <Page>
            <PositionHeader position={InterviewPosition.Suspect} />
            <P>The interview will start when the Interviewer is ready.</P>
            {robotPrompt}

            <SuspectRole role={props.role} />
            
            <P>Penalty: {props.penalty}</P>
            <P>Suspect background: {props.suspectBackground}</P>
        </Page>
    );
}