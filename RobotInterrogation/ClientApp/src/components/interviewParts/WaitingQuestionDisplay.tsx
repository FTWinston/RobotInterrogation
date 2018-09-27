import * as React from 'react';
import { InterviewQuestion } from './elements/InterviewQuestion';
import './ItemGroup.css';

interface IProps {
    primary: string[],
    secondary: string[],
    waitingFor: string,
}

export class WaitingQuestionDisplay extends React.PureComponent<IProps> {
    public render() {
        const primary = this.props.primary.map((q, i) => <InterviewQuestion primary={true} question={q} key={i} />);
        const secondary = this.props.secondary.map((q, i) => <InterviewQuestion primary={false} question={q} key={i} />);

        return <div>
            <h2>You are the interviewer.</h2>

            <p>Waiting for the suspect to select their {this.props.waitingFor}. Your questions are as follows:</p>
            <div className="itemGroup">
                {primary}
                {secondary}
            </div>
        </div>
    }
}