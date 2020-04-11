import * as React from 'react';
import './ActionSet.css';
import { IInterviewQuestion, InterviewQuestion } from './elements/InterviewQuestion';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';

interface IProps {
    prompt: string,
    questions: IInterviewQuestion[],
    suspectBackground: string,
    penalty: string,
    ready: () => void,
}

export const InterviewerReadyToStart: React.FunctionComponent<IProps> = props => {
    const questions = props.questions.map((q, i) => {

        return (
            <InterviewQuestion
                question={q}
                key={i}
            />
        )
    });

    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <p>Ask the suspect their name and confirm their background.<br/>When you are ready, read them the prompt, then start the timer.</p>
            <div>
                {questions}
            </div>
            <p>Penalty: {props.penalty}</p>
            <p>Suspect background: {props.suspectBackground}</p>

            <p>Prompt: {props.prompt}</p>
            
            <div className="actionSet">
                <button onClick={props.ready} className="btn btn-primary">Start the Timer</button>
            </div>
        </div>
    );
}