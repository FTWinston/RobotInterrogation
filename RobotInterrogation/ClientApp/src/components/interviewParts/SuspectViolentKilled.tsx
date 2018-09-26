import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class SuspectViolentKilled extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">You successfully completed your obsession and killed the interviewer.</p>
            <p>You win.</p>

            <SuspectRole role={this.props.role} />
        </div>
    }
}