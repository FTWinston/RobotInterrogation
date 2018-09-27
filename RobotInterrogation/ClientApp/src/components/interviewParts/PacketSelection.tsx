import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export class PacketSelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the interviewer.</h2>
            <p>Please select an interview packet to use for this interview.</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}