import React from 'react';

interface Props {
    packet: string;
}

export const PacketDisplay: React.FC<Props> = props => (
    <>
        <p>Using this interview packet:</p>
        <p className="valueDisplay">{props.packet}</p>
    </>
)