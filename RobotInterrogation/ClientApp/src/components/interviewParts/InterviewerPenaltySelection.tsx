import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export class InterviewerPenaltySelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the interviewer.</h2>
            <p>Select one of the following penalities to <strong>discard</strong>. The suspect will choose from the remaining two.</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}