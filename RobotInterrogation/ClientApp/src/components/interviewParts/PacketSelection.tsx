import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export const PacketSelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the interviewer.</h2>
            <p>Please select an interview packet to use for this interview.</p>

            {renderOptions(props.options, props.action)}
        </div>
    )
}