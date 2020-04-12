import * as React from 'react';
import { IInterviewQuestion } from './elements/InterviewQuestion';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { SortableQuestions } from './elements/SortableQuestions';

interface IProps {
    questions: IInterviewQuestion[],
    sortQuestions: (questions: IInterviewQuestion[]) => void;
}

export const WaitingQuestionDisplay: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <p>Waiting for the Suspect to select their background. Your questions are as follows:</p>

            <SortableQuestions
                questions={props.questions}
                sort={props.sortQuestions}
            />
        </div>
    );
}