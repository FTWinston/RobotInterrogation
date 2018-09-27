import * as React from 'react';
import './SuspectRole.css';

export interface ISuspectRole {
    type: string;
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

        const classes = 'suspectRole suspectRole--' + this.props.role.type;
        const traits = this.props.role.traits.map((t, i) => <div className="suspectRole__trait" key={i}>{t}</div>);

        return <div className={classes} onClick={onClick}>
            <div className="suspectRole__name">{this.props.role.type}</div>
            <div className="suspectRole__traits">
                {traits}
            </div>
        </div>;
    }
}
