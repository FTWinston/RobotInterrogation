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
    terminateInterviewer: () => void;
}

export const SuspectInProgress: React.FunctionComponent<IProps> = props => {
    const terminate = props.role.type === 'ViolentRobot'
        ? (
            <ActionSet>
                <Button variant="outlined" color="secondary" onClick={props.terminateInterviewer}>Kill interviewer</Button>
            </ActionSet>
        )
        : undefined;
    
    const robotPrompt = props.role.type === 'ViolentRobot'
        ? <P>
            You must complete 2 of the 3 tasks listed below, <em>and then wait 10 seconds</em> before you can kill the Interviewer.<br/>
            If you cannot kill the Interviewer before finishing answering their final question, you must visibly malfunction.
        </P>
        : props.role.type === 'PassiveRobot'
            ? <P>You must perform the penalty each time you violate your vulnerability.</P>
            : undefined;

    const [elapsed, setElapsed] = useState(false);

    const elapsedPrompt = elapsed
        ? <P>The interviewer can ask one final question.</P>
        : <P/>;

    return <Page>
        <PositionHeader position={InterviewPosition.Suspect} />
        <P>Answer the Interviewer's questions, try to convince them that you are human.</P>
        {robotPrompt}

        <SuspectRole role={props.role} />
        
        <P>Penalty: {props.penalty}</P>
        
        <P>Your background: {props.suspectBackground}</P>

        <Countdown
            duration={props.duration}
            onElapsed={() => setElapsed(true)}
        />

        {elapsedPrompt}

        {terminate}
    </Page>
}