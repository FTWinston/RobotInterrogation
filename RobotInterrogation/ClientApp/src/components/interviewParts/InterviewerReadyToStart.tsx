import * as React from 'react';
import { IInterviewQuestion } from './elements/InterviewQuestion';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { SortableQuestions } from './elements/SortableQuestions';
import { ActionSet } from './elements/ActionSet';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Button } from '@material-ui/core';
import { Help } from './elements/Help';

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
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <P>Ask the Suspect their name, then confirm their background.<br/>When you are ready, read them the prompt, then start the timer.</P>

            <SortableQuestions
                questions={props.questions}
                sort={props.sortQuestions}
            />

            <P><Help entry="penalty">Penalty</Help>: {props.penalty}</P>
            <P>Suspect <Help entry="background">background</Help>: {props.suspectBackground}</P>

            <P>Prompt: {props.prompt}</P>
            
            <ActionSet>
                <Button variant="outlined" color="primary" onClick={props.ready}>Start the Timer</Button>
            </ActionSet>
        </Page>
    );
}