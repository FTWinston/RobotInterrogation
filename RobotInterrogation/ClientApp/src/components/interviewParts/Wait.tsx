import * as React from 'react';
import { InterviewPosition } from '../interviewReducer';
import { PositionHeader } from './elements/PositionHeader';

interface IProps {
    position: InterviewPosition,
    waitFor: string,
}

export const Wait: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <PositionHeader position={props.position} />
            <p>Wait for {props.waitFor}.</p>
        </div>
    );
}