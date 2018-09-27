import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class InterviewerRobotCorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p>You correctly identified the suspect as a robot.</p>
            <h2>You win.</h2>

            <SuspectRole role={this.props.role} />
        </div>
    }
}