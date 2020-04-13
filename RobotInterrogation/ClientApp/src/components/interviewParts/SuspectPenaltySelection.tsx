import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { Help } from './elements/Help';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { ChoiceArray } from './elements/ChoiceArray';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const SuspectPenaltySelection: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Suspect} />
            <P>Select one of the following <Help entry="penalty">penalties</Help> to <strong>use</strong> for this interview.</P>
            
            <ChoiceArray options={props.options} action={props.action} />
        </Page>
    );
}