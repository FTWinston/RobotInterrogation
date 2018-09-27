import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class SuspectViolentKilled extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p>You completed your obsession and killed the interviewer.</p>
            <h2>You win.</h2>

            <SuspectRole role={this.props.role} />
        </div>
    }
}