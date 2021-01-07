import * as React from 'react';
import { InterviewPosition, InterviewStatus } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { Help } from './elements/Help';
import { P } from './elements/P';
import { Page } from './elements/Page';
import { ChoiceArray } from './elements/ChoiceArray';

interface IProps {
    turn: InterviewPosition,
    options: string[],
}

export const SpectatorPenaltySelection: React.FunctionComponent<IProps> = props => {
    const message = props.turn === InterviewPosition.Interviewer
        ? <P>Waiting for interviewer to <strong>discard</strong> a <Help entry="penalty">penalty</Help>.</P>
        : <P>Waiting for suspect to <strong>choose</strong> a <Help entry="penalty">penalty</Help>.</P>

    return (
        <Page>
            <PositionHeader position={InterviewPosition.Spectator} />
            {message}
            
            <ChoiceArray options={props.options} />
        </Page>
    );
}