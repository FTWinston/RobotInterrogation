import * as React from 'react';
import { Link } from 'react-router-dom';

export const OpponentDisconnected: React.FunctionComponent = () => {
    return (
        <div>
            <p className="lead">Your opponent disconnected from the interview.</p>

            <div className="actionSet">
                <Link to="/">Go back</Link>
            </div>
        </div>
    );
}