import * as React from 'react';
import { InterviewPosition, InterviewStatus } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { Help } from './elements/Help';
import { P } from './elements/P';
import { Page } from './elements/Page';

interface IProps {
    status: InterviewStatus
}

export const SpectatorPlaceholder: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={InterviewPosition.Spectator} />
            <P>Spectating still in development</P>
            <P>Interview Status: {InterviewStatus[props.status]}</P>
        </Page>
    );
}