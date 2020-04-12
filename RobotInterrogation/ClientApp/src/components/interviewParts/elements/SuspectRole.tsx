import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import './SuspectRole.css';

export interface ISuspectRole {
    type: string;
    fault: string;
    traits: string,
}

interface IProps {
    role: ISuspectRole;
    onClick?: () => void;
}

export const SuspectRole: React.FunctionComponent<IProps> = props => {
    const onClick = props.onClick !== undefined
        ? () => props.onClick!()
        : undefined;

    let classes = 'suspectRole suspectRole--' + props.role.type;
    if (props.onClick) {
        classes += ' suspectRole--selectable';
    }

    let displayName = props.role.type.replace('Robot', ' Robot');
    if (props.role.type !== "Human") {
        displayName += ` (${props.role.fault})`;
    }

    return (
        <div className={classes} onClick={onClick}>
            <div className="suspectRole__name">{displayName}</div>
            <ReactMarkdown source={props.role.traits} className="suspectRole__traits" />
        </div>
    )
}
