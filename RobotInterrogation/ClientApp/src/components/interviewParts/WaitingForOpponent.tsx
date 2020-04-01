import * as React from 'react';
import './GameLink.css';

interface IProps {
    interviewID: string;
}

export const WaitingForOpponent: React.FunctionComponent<IProps> = props => {
    const fullLocation = document.location.toString();
    const strippedProtocol = fullLocation.substr(fullLocation.indexOf('//') + 2);

    let fixedLocation = strippedProtocol.substr(0, strippedProtocol.indexOf(props.interviewID));
    let detailLocation;

    if (fixedLocation.length === 0) {
        fixedLocation = strippedProtocol;
        detailLocation = '';
    }
    else {
        detailLocation = props.interviewID;
    }

    return (
        <div>
            <h2>Waiting for opponent to&nbsp;join.</h2>

            <p>
                Invite a friend by giving them this link:
            </p>

            <p>
                <a target="_new" className="gameLink" href={fullLocation}>{fixedLocation}<wbr/><span className="gameLink__focus">{detailLocation}</span></a>
            </p>

            <p>
                <strong>Don't</strong> open the link yourself, or you will become your own opponent.
            </p>
        </div>
    );
}