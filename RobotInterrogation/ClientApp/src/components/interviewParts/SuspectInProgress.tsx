import * as React from 'react';
import './ActionSet.css';
import { Countdown } from './elements/Countdown';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    suspectNote: string,
    penalty: string,
    role: ISuspectRole,
    duration: number,
    terminateInterviewer: () => void,
}

export class SuspectInProgress extends React.PureComponent<IProps> {
    public render() {
        const terminate = this.props.role.type === 'ViolentRobot'
            ? <div className="actionSet"><button className="btn btn-danger" onClick={this.props.terminateInterviewer}>Kill interviewer</button></div>
            : undefined;

        const robotPrompt = this.props.role.type === 'ViolentRobot'
            ? <p>You must complete 2 of the 3 tasks listed before you can kill the interviewer.</p>
            : this.props.role.type === 'PassiveRobot'
                ? <p>You must perform the penalty each time you violate your vulnerability.</p>
                : undefined;

        return <div>
            <h2>You are the suspect.</h2>
            <p>Answer the interviewer's questions, try to convince them that you are human.</p>
            {robotPrompt}

            <SuspectRole role={this.props.role} />
            <p>Penalty: {this.props.penalty}</p>
            <p>Your background: {this.props.suspectNote}</p>

            <Countdown duration={this.props.duration} />

            {terminate}
        </div>
    }
}