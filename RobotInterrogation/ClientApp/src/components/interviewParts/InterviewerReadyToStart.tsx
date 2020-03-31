import * as React from 'react';
import './ActionSet.css';
import { IInterviewQuestion, InterviewQuestion } from './elements/InterviewQuestion';

interface IProps {
    prompt: string,
    primary: IInterviewQuestion[],
    secondary: IInterviewQuestion[],
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
            <p>When you are ready, ask the suspect to perform the penalty 3 times. When they have done so, confirm their identity, read them the prompt, and start the timer at the bottom of the page.</p>
            <p>Prompt: {this.props.prompt}</p>
            <div>
                {primary}
                {secondary}
            </div>
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Identity: {this.props.suspectNote}</p>

            <div className="actionSet">
                <button onClick={this.props.ready} className="btn btn-primary">Start the Timer</button>
            </div>
        </div>
    }
}