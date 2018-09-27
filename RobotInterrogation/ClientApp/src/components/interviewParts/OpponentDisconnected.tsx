import * as React from 'react';
import { Link } from 'react-router-dom';

export class OpponentDisconnected extends React.PureComponent {
    public render() {
        return <div>
            <p className="lead">Your opponent disconnected from the interview.</p>

            <div className="actionSet">
                <Link to="/">Go back</Link>
            </div>
        </div>
    }
}