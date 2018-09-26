import * as React from 'react';

interface IProps {
    interviewID: string;
}

export class WaitingForOpponent extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">Waiting for other player to join interview {this.props.interviewID}.</p>

            <p>
                Give them this link: <a href={document.location.toString()}>{document.location.toString()}</a>.
                <br />
                <strong>Don't</strong> visit the link yourself, or you will become your own opponent.
            </p>
        </div>
    }
}