import * as React from 'react';
import { IInterviewQuestion } from './elements/InterviewQuestion';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { SortableQuestions } from './elements/SortableQuestions';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Help } from './elements/Help';

interface IProps {
    questions: IInterviewQuestion[],
    sortQuestions: (questions: IInterviewQuestion[]) => void;
}

export const WaitingQuestionDisplay: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />

            <P>
                Waiting for the Suspect to select their <Help entry="background">background</Help>.
                <br/>Your <Help entry="questions">questions</Help> are as follows:
            </P>

            <SortableQuestions
                questions={props.questions}
                sort={props.sortQuestions}
            />
        </Page>
    );
}