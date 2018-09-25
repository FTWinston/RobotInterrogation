import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export class InterviewerPenaltySelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">You are the interviewer.</p>
            <p>Please select one of the following penalities to <strong>discard</strong>. The suspect will choose from the remaining two.</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}