import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class SuspectRobotCorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">The interviewer correctly identified you as a robot.</p>
            <p>You lose.</p>

            <SuspectRole role={this.props.role} />
        </div>
    }
}