import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import './ValueDisplay.css';
import { PositionHeader } from './elements/PositionHeader';
import { InterferenceSolution } from './elements/InterferenceSolution';

interface IProps {
    solution: string[];
    packet: string;
    continue: () => void;
}

export const InducerPrompt: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <p>The chosen interview packet is:</p>
            <p className="valueDisplay">{props.packet}</p>

            <InterferenceSolution solution={props.solution} />

            <p>
                Ask the suspect a question based on the sequence above, then click below to administer the inducer, revealing the suspect's role to them, along with an interference task that will allow them to answer your question.
                <br/>
            </p>

            <div>
                Example questions:
                <ul>
                    <li>What letters come between A and D?</li>
                    <li>What letter follows B?</li>
                </ul>
            </div>
            
            <div className="actionSet">
                <button onClick={() => props.continue()}>Continue</button>
            </div>
        </div>
    )
}