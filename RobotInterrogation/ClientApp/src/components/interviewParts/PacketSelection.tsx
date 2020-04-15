import React from 'react';
import { PositionHeader } from './elements/PositionHeader';
import { InterviewPosition, IPacket } from '../interviewReducer';
import { P } from './elements/P';
import { Page } from './elements/Page';
import { Help } from './elements/Help';
import Phone from '@material-ui/icons/Phone';
import Transform from '@material-ui/icons/Transform';
import WbIncandescent from '@material-ui/icons/WbIncandescent';
import People from '@material-ui/icons/People';
import Favorite from '@material-ui/icons/Favorite';
import SentimentVeryDissatisfied from '@material-ui/icons/SentimentVeryDissatisfied';
import Warning from '@material-ui/icons/Warning';
import LocalBar from '@material-ui/icons/LocalBar';
import TransferWithinAStation from '@material-ui/icons/TransferWithinAStation';
import Portrait from '@material-ui/icons/Portrait';
import BeachAccess from '@material-ui/icons/BeachAccess';
import HelpOutline from '@material-ui/icons/HelpOutline';
import { List, ListItemIcon, ListItem, ListItemText } from '@material-ui/core';

interface IProps {
    options: IPacket[],
    action: (index: number) => void,
}

export const PacketSelection: React.FunctionComponent<IProps> = props => {
    const options = props.options.map((packet, index) => (
        <ListItem button key={index} onClick={() => props.action(index)}>
            <ListItemIcon>
                {getIcon(packet.icon)}
            </ListItemIcon>
            <ListItemText primary={packet.name} secondary={packet.difficulty} />
        </ListItem>
    ));

    return (
        <Page>
            <PositionHeader position={InterviewPosition.Interviewer} />
            <P>Please select an interview <Help entry="packet">packet</Help> to use for this interview.</P>

            <List>{options}</List>
        </Page>
    )
}

function getIcon(name: string) {
    switch (name) {
        case 'phone':
            return <Phone />
        case 'problem':
            return <Transform />
        case 'imagine':
            return <WbIncandescent />
        case 'cooperate':
            return <People />
        case 'dream':
            return <BeachAccess />
        case 'body':
            return <Favorite />
        case 'grief':
            return <SentimentVeryDissatisfied />
        case 'threat':
            return <Warning />
        case 'moral':
            return <LocalBar />
        case 'self':
            return <Portrait />
        case 'intent':
            return <TransferWithinAStation />
        default:
            return <HelpOutline />
    }
}