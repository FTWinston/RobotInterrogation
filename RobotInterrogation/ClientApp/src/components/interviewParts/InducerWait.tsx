import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { PacketDisplay } from './elements/PacketDisplay';
import { Page } from './elements/Page';
import { P } from './elements/P';
import { Help } from './elements/Help';

interface IProps {
    position: InterviewPosition;
    packet: string;
}

export const InducerWait: React.FunctionComponent<IProps> = props => {
    return (
        <Page>
            <PositionHeader position={props.position} />

            <PacketDisplay packet={props.packet} />

            <P>The Interviewer will ask you a question, and then administer the <Help entry="inducer">inducer</Help>.</P>
            <P>You will see your <Help entry="roles">role</Help> for this interview, and a diagram you will need to answer the Interviewer's question.</P>
            <P>Answer the question correctly to be able to choose your <Help entry="background">background</Help>.</P>
        </Page>
    )
}