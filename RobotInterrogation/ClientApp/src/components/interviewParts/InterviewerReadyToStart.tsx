import * as React from 'react';
import { InterviewQuestion } from './elements/InterviewQuestion';

interface IProps {
    primary: string[],
    secondary: string[],
    suspectNote: string,
    penalty: string,
    ready: () => void,
}

export class InterviewerReadyToStart extends React.PureComponent<IProps> {
    public render() {
        const primary = this.props.primary.map((q, i) => <InterviewQuestion primary={true} question={q} key={i} />);
        const secondary = this.props.secondary.map((q, i) => <InterviewQuestion primary={false} question={q} key={i} />);

        return <div>
            <h2>You are the interviewer.</h2>
            <p>When you are ready, ask the suspect to perform the penalty 3 times. When they have done so, confirm their suspect note, and start the timer.</p>
            <div>
                {primary}
                {secondary}
            </div>
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Note: {this.props.suspectNote}</p>

            <button onClick={this.props.ready} className="btn btn-primary">Start the Timer</button>
        </div>
    }
}