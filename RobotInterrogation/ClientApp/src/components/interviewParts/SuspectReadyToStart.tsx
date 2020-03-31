import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    suspectNote: string,
    penalty: string,
    role: ISuspectRole,
}

export class SuspectReadyToStart extends React.PureComponent<IProps> {
    public render() {
        const robotPrompt = this.props.role.type === 'ViolentRobot'
            ? <p>You must complete 2 of the 3 tasks listed below, <em>and then wait 10 seconds</em> before you can kill the interviewer.</p>
            : this.props.role.type === 'PassiveRobot'
                ? <p>You must perform the penalty each time you violate your vulnerability.</p>
                : undefined;

        return <div>
            <h2>You are the suspect.</h2>
            <p>When the interviewer is ready, the interview will start.</p>
            {robotPrompt}

            <SuspectRole role={this.props.role} />
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect background: {this.props.suspectNote}</p>
        </div>
    }
}