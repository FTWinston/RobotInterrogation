import * as React from 'react';
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
            ? <button className="btn btn-danger" onClick={this.props.terminateInterviewer}>Kill interviewer</button>
            : undefined;

        return <div>
            <p>You are the suspect. Answer the interviewer's questions.</p>

            <SuspectRole role={this.props.role} />
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Note: {this.props.suspectNote}</p>

            <Countdown duration={this.props.duration} />

            {terminate}
        </div>
    }
}