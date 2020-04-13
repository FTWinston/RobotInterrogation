import * as React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition } from '../interviewReducer';
import { ChoiceArray } from './elements/ChoiceArray';
import { P } from './elements/P';
import { Page } from './elements/Page';
import { Help } from './elements/Help';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const PacketSelection: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <P>Please select an interview <Help entry="packet">packet</Help> to use for this interview.</P>

            <ChoiceArray options={props.options} action={props.action} />
        </Page>
    )
}