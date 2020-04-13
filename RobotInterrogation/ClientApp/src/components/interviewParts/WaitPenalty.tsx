import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Help } from './elements/Help';

interface IProps {
    position: InterviewPosition;
}

export const WaitPenalty: React.FunctionComponent<IProps> = props => {
    const msg = props.position === InterviewPosition.Interviewer
        ? <P>Wait for the Suspect to choose a <Help entry="penalty">penalty</Help>.</P>
        : <P>Wait for the Interviewer to discard a <Help entry="penalty">penalty</Help>.</P>
        
    return (
        <Page>
            <PositionHeader position={props.position} />
            {msg}
        </Page>
    );
}