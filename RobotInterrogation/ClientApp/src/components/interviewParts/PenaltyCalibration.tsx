import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { ActionSet } from './elements/ActionSet';
import { Page } from './elements/Page';
import { Button } from '@material-ui/core';
import { P } from './elements/P';
import { Help } from './elements/Help';
import { ValueDisplay } from './elements/ValueDisplay';

interface IProps {
    position: InterviewPosition;
    penalty: string;
    confirm?: () => void;
}

export const PenaltyCalibration: React.FunctionComponent<IProps> = props => {
    const extraMessage = [
        <P>Ask the Suspect to perform this penalty 3 times.<br />When you are satisfied that they have done so, click to continue.</P>,
        <P>The Interviewer will now ask you to perform this penalty 3 times.</P>,
        <P>Waiting for the Suspect to perform this penalty 3 times.</P>
    ][props.position];

    const confirm = props.confirm
        ? (
            <ActionSet>
                <Button variant="outlined" onClick={() => props.confirm!()}>Continue</Button>
            </ActionSet>
        )
        : undefined;

    return (
        <Page>
            <PositionHeader position={props.position} />

            <ValueDisplay value={props.penalty}>The chosen <Help entry="penalty">penalty</Help> is:</ValueDisplay>

            {extraMessage}
            {confirm}
        </Page>
    )
}