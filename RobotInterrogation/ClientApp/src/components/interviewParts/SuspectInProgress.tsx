import * as React from 'react';
import './ActionSet.css';
import { Countdown } from './elements/Countdown';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { useState } from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

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
            <div className="actionSet">
                <button onClick={props.terminateInterviewer}>Kill interviewer</button>
            </div>
        )
        : undefined;
    
    const robotPrompt = props.role.type === 'ViolentRobot'
        ? <p>
            You must complete 2 of the 3 tasks listed below, <em>and then wait 10 seconds</em> before you can kill the interviewer.<br/>
            If you cannot kill the interviewer before finishing answering their final question, you must visibly malfunction.
        </p>
        : props.role.type === 'PassiveRobot'
            ? <p>You must perform the penalty each time you violate your vulnerability.</p>
            : undefined;

    const [elapsed, setElapsed] = useState(false);

    const elapsedPrompt = elapsed
        ? <p>The interviewer can ask one final question.</p>
        : <p/>;

    return <div>
        <PositionHeader position={InterviewPosition.Suspect} />
        <p>Answer the interviewer's questions, try to convince them that you are human.</p>
        {robotPrompt}

        <SuspectRole role={props.role} />
        
        <p>Penalty: {props.penalty}</p>
        
        <p>Your background: {props.suspectBackground}</p>

        <Countdown
            duration={props.duration}
            onElapsed={() => setElapsed(true)}
        />

        {elapsedPrompt}

        {terminate}
    </div>
}