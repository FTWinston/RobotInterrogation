import * as React from 'react';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';
import './ItemGroup.css';

interface IProps {
    options: ISuspectRole[],
    action: (index: number) => void,
}

export class RoleSelection extends React.PureComponent<IProps> {
    public render() {
        const roles = this.props.options.map((o, i) => {
            const onClick = () => this.props.action(i);
            return <SuspectRole role={o} key={i} onClick={onClick} />;
        });

        return <div>
            <h2>You are the suspect.</h2>

            <p>Select your role for this interview.</p>
            <p>No matter your choice, you should try to convince the interviewer that you are <strong>human</strong>.</p>

            <div className="itemGroup">
                {roles}
            </div>
        </div>
    }
}