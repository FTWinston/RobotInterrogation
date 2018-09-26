import * as React from 'react';

interface IProps {
    interviewID: string;
}

export class WaitingForOpponent extends React.PureComponent<IProps> {
    public render() {
        const fullLocation = document.location.toString();

        let fixedLocation = fullLocation.substr(0, fullLocation.indexOf(this.props.interviewID));
        let detailLocation;

        if (fixedLocation.length === 0) {
            fixedLocation = fullLocation;
            detailLocation = '';
        }
        else {
            detailLocation = this.props.interviewID;
        }

        return <div>
            <p className="lead">Waiting for other player to join the interview.</p>

            <p>
                Give them this link: <a className="link" href={fullLocation}>{fixedLocation}<span className="link__focus">{detailLocation}</span></a>
                <br />
                <strong>Don't</strong> visit the link yourself, or you will become your own opponent.
            </p>
        </div>
    }
}