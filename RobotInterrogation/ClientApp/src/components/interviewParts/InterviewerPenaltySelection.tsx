import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Help } from './elements/Help';
import { ChoiceArray } from './elements/ChoiceArray';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const InterviewerPenaltySelection: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <P>Select one of the following <Help entry="penalty">penalties</Help> to <strong>discard</strong>. The Suspect will choose from the remaining two.</P>

            <ChoiceArray options={props.options} action={props.action} />
        </Page>
    );
}