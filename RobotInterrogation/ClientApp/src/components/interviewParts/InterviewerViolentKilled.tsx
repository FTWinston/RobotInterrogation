import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class InterviewerViolentKilled extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p>The suspect was a violent robot who completed their obsession and killed you.</p>
            <h2>You lose.</h2>

            <SuspectRole role={this.props.role} />
        </div>
    }
}