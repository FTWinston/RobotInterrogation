import * as React from 'react';
import './SuspectRole.css';

export interface ISuspectRole {
    type: string;
    fault: string;
    traits: string[],
}

interface IProps {
    role: ISuspectRole;
    onClick?: () => void;
}

export class SuspectRole extends React.PureComponent<IProps, {}> {
    public render() {
        const onClick = this.props.onClick !== undefined
            ? () => this.props.onClick!()
            : undefined;

        let classes = 'suspectRole suspectRole--' + this.props.role.type;
        if (this.props.onClick) {
            classes += ' suspectRole--selectable';
        }

        const traits = this.props.role.traits.map((t, i) => <li className="suspectRole__trait" key={i}>{t}</li>);
        let displayName = this.props.role.type.replace('Robot', ' Robot');
        if (this.props.role.type !== "Human") {
          displayName += ` (${this.props.role.fault})`;
		}

        return <div className={classes} onClick={onClick}>
            <div className="suspectRole__name">{displayName}</div>
            <ul className="suspectRole__traits">
                {traits}
            </ul>
        </div>;
    }
}
