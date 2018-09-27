import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    role: ISuspectRole;
}

export class InterviewerHumanIncorrect extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the interviewer.</h2>
            <p>You wrongly identified the suspect as a human. They are acutally a robot.</p>
            <p>You lose.</p>

            <SuspectRole role={this.props.role} />
        </div>
    }
}