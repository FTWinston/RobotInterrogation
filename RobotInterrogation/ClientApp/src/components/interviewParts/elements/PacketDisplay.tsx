import React from 'react';
import { ValueDisplay } from './ValueDisplay';
import { Help } from './Help';

interface Props {
    packet: string;
}

export const PacketDisplay: React.FC<Props> = props => (
    <ValueDisplay value={props.packet}>Interview <Help entry="packet">packet</Help>:</ValueDisplay>
)