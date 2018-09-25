import * as React from 'react';

interface IProps {
    role: string;
    packet: string;
}

export class PacketDisplay extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p> You are the {this.props.role}. The chosen interview packet is:</p>
            <p className="text-large">{this.props.packet}</p>
        </div>
    }
}