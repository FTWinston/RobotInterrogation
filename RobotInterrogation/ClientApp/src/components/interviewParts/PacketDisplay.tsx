import * as React from 'react';
import './ValueDisplay.css';

interface IProps {
    role: string;
    packet: string;
}

export const PacketDisplay: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the {props.role}.</h2>

            <p>The chosen interview packet is:</p>
            <p className="valueDisplay">{props.packet}</p>
        </div>
    )
}