import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class InterviewerHumanIncorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p>You wrongly identified the suspect as a human. They are acutally a robot.</p>
            <h2>You lose.</h2>

            <SuspectRole role={this.props.role} />
        </div>
    }
}