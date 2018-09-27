import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class SuspectHumanIncorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p>The interviewer wrongly identified you as a human.</p>
            <h2>You win.</h2>

            <SuspectRole role={this.props.role} />
        </div>
    }
}