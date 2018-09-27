import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    suspectNote: string,
    penalty: string,
    role: ISuspectRole,
}

export class SuspectReadyToStart extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the suspect.</h2>
            <p>When the interviewer is ready, the interview will start.</p>

            <SuspectRole role={this.props.role} />
            <p>Penalty: {this.props.penalty}</p>
            <p>Suspect Note: {this.props.suspectNote}</p>
        </div>
    }
}