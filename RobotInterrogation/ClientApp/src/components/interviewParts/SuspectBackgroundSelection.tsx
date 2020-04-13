import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';
import { ActionSet } from './elements/ActionSet';
import { ChoiceArray } from './elements/ChoiceArray';
import { Button, Typography } from '@material-ui/core';
import { P } from './elements/P';
import { Help } from './elements/Help';
import { Page } from './elements/Page';

interface IProps {
    options: string[],
    role: ISuspectRole;
    action: (index: number) => void,
}

export const SuspectBackgroundSelection: React.FunctionComponent<IProps> = props => {
    const message = props.options.length === 1
        ? <P>You answered incorrectly. You can only choose the following <Help entry="background">background</Help>:</P>
        : <P>You answered correctly. Select one of the following <Help entry="background">backgrounds</Help>:</P>

    const options = props.options.length === 1
        ? (
            <ActionSet>
                <Button variant="outlined" onClick={() => props.action(0)}>{props.options[0]}</Button>
            </ActionSet>
        )
        : <ChoiceArray options={props.options} action={props.action} />

    return (
        <Page>
            <PositionHeader position={InterviewPosition.Suspect} />

            <Typography>Your <Help entry="roles">role</Help>:</Typography>
            <SuspectRole role={props.role} />

            {message}

            {options}
        </Page>
    );
}