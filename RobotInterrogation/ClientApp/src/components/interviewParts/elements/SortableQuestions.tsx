import * as React from 'react';
import FlipMove from 'react-flip-move';
import { IInterviewQuestion, InterviewQuestion } from './InterviewQuestion';

interface IProps {
    questions: IInterviewQuestion[];
    sort: (questions: IInterviewQuestion[]) => void;
}

export const SortableQuestions: React.FunctionComponent<IProps> = props => {
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
            
            props.sort(sorted);
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
            <FlipMove>
                {questions}
            </FlipMove>
        </div>
    )
}
