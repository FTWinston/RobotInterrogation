import * as React from 'react';
import './ActionSet.css';
import { Countdown } from './elements/Countdown';
import { IInterviewQuestion, InterviewQuestion } from './elements/InterviewQuestion';

interface IProps {
    prompt: string,
    primary: IInterviewQuestion[],
    secondary: IInterviewQuestion[],
    suspectNote: string,
    penalty: string,
    duration: number,
    conclude: (isRobot: boolean) => void,
}

export class InterviewerInProgress extends React.PureComponent<IProps> {
    public render() {
        const primary = this.props.primary.map((q, i) => <InterviewQuestion primary={true} question={q} key={i} />);
        const secondary = this.props.secondary.map((q, i) => <InterviewQuestion primary={false} question={q} key={i} />);

        const isHuman = () => this.props.conclude(false);
        const isRobot = () => this.props.conclude(true);

        return <div>
            <h2>You are the interviewer.</h2>
            <p>Ask the suspect questions and decide whether they are human or a robot.</p>
            <p>Prompt: {this.props.prompt}</p>
            <div>
                {primary}
                {secondary}
            </div>
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Identity: {this.props.suspectNote}</p>

            <Countdown duration={this.props.duration} />

            <div className="actionSet">
                <button onClick={isHuman}>Suspect is Human</button>
                <button onClick={isRobot}>Suspect is a Robot</button>
            </div>
        </div>
    }
}