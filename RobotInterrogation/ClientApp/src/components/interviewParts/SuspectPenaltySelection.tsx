import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export class SuspectPenaltySelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">You are the suspect.</p>
            <p>Please select one of the following penalities to <strong>use</strong> for this interview.</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}