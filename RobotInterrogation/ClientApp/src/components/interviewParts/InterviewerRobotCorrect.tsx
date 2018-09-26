import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class InterviewerRobotCorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">You correctly identified the suspect as a robot.</p>
            <p>You win.</p>

            <SuspectRole role={this.props.role} />
        </div>
    }
}