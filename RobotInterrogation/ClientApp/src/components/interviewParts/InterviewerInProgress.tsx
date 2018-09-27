import * as React from 'react';
import { Countdown } from './elements/Countdown';
import { InterviewQuestion } from './elements/InterviewQuestion';

interface IProps {
    primary: string[],
    secondary: string[],
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
            <div>
                {primary}
                {secondary}
            </div>
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Note: {this.props.suspectNote}</p>

            <Countdown duration={this.props.duration} />

            <button onClick={isHuman} className="btn btn-success">Human</button>
            <button onClick={isRobot} className="btn btn-danger">Robot</button>
        </div>
    }
}