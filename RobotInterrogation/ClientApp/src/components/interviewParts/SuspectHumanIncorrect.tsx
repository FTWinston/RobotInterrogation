import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class SuspectHumanIncorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the suspect.</h2>
            <p>The interviewer wrongly identified you as a human.</p>
            <p>You win.</p>

            <SuspectRole role={this.props.role} />
        </div>
    }
}