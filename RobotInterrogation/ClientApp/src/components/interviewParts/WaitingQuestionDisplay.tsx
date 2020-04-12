import * as React from 'react';
import { IInterviewQuestion, InterviewQuestion } from './elements/InterviewQuestion';
import './ItemGroup.css';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';

interface IProps {
    questions: IInterviewQuestion[],
}

export const WaitingQuestionDisplay: React.FunctionComponent<IProps> = props => {
    const questions = props.questions.map((q, i) => <InterviewQuestion question={q} key={i} />);

    return (
        <div>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <p>Waiting for the Suspect to select their background. Your questions are as follows:</p>
            <div className="itemGroup">
                {questions}
            </div>
        </div>
    );
}