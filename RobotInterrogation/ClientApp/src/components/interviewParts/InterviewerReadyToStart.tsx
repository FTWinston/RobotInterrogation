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
    sortQuestions: (questions: IInterviewQuestion[]) => void;
}

export const InterviewerReadyToStart: React.FunctionComponent<IProps> = props => {
    const questions = props.questions.map((q, i) => {
        const sort = (up: boolean) => {
            const sorted = props.questions.slice();
            sorted.splice(i, 1);
            const sortQuestion = props.questions[i];
            
            if (up) {
                if (i > 0) {
                    sorted.splice(i - 1, 0, sortQuestion);
                }
            }
            else if (i < props.questions.length - 1) {
                sorted.splice(i + 1, 0, sortQuestion);
            }
            
            props.sortQuestions(sorted);
        }

        return (
            <InterviewQuestion
                question={q}
                key={q.challenge}
                sort={sort}
            />
        )
    });

    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <p>Ask the Suspect their name and confirm their background.<br/>When you are ready, read them the prompt, then start the timer.</p>
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