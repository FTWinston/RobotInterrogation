import * as React from 'react';
import './ActionSet.css';
import { IInterviewQuestion } from './elements/InterviewQuestion';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { SortableQuestions } from './elements/SortableQuestions';

interface IProps {
    prompt: string,
    questions: IInterviewQuestion[],
    suspectBackground: string,
    penalty: string,
    ready: () => void,
    sortQuestions: (questions: IInterviewQuestion[]) => void;
}

export const InterviewerReadyToStart: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <p>Ask the Suspect their name and confirm their background.<br/>When you are ready, read them the prompt, then start the timer.</p>

            <SortableQuestions
                questions={props.questions}
                sort={props.sortQuestions}
            />

            <p>Penalty: {props.penalty}</p>
            <p>Suspect background: {props.suspectBackground}</p>

            <p>Prompt: {props.prompt}</p>
            
            <div className="actionSet">
                <button onClick={props.ready} className="btn btn-primary">Start the Timer</button>
            </div>
        </div>
    );
}