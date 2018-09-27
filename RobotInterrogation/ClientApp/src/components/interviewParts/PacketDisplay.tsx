import * as React from 'react';
import './ValueDisplay.css';

interface IProps {
    role: string;
    packet: string;
}

export class PacketDisplay extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the {this.props.role}.</h2>

            <p>The chosen interview packet is:</p>
            <p className="valueDisplay">{this.props.packet}</p>
        </div>
    }
}