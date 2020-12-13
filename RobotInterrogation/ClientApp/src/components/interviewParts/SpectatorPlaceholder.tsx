import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { Help } from './elements/Help';
import { P } from './elements/P';
import { Page } from './elements/Page';

interface IProps {
    position: InterviewPosition;
}

export const SpectatorPlaceholder: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={props.position} />
            <P>Spectating still in development</P>
        </Page>
    );
}