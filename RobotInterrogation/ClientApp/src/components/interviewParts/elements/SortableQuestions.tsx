import * as React from 'react';
import FlipMove from 'react-flip-move';
import { IInterviewQuestion, InterviewQuestion } from './InterviewQuestion';

interface IProps {
    questions: IInterviewQuestion[];
    sort: (questions: IInterviewQuestion[]) => void;
}

export const SortableQuestions: React.FunctionComponent<IProps> = props => {
    const questions = props.questions.map((q, i) => {
        const sortUp = i === 0
            ? undefined
            : () => {
                const sorted = props.questions.slice();
                sorted.splice(i, 1);
                const sortQuestion = props.questions[i];
                sorted.splice(i - 1, 0, sortQuestion);
                props.sort(sorted);
            };

        const sortDown = i === props.questions.length - 1
            ? undefined
            : () => {
                const sorted = props.questions.slice();
                sorted.splice(i, 1);
                const sortQuestion = props.questions[i];
                sorted.splice(i + 1, 0, sortQuestion);
                props.sort(sorted);
            };
        
        return (
            <InterviewQuestion
                question={q}
                key={q.challenge}
                sortUp={sortUp}
                sortDown={sortDown}
            />
        )
    });
    
    return (
        <FlipMove>
            {questions}
        </FlipMove>
    )
}
