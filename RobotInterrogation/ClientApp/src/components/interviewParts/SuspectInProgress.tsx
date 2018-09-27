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

        return <div>
            <h2>You are the suspect.</h2>
            <p>Answer the interviewer's questions, try to convince them that you are human.</p>

            <SuspectRole role={this.props.role} />
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Note: {this.props.suspectNote}</p>

            <Countdown duration={this.props.duration} />

            {terminate}
        </div>
    }
}