import * as React from 'react';
import { Link } from 'react-router-dom';

export const Disconnected: React.FunctionComponent = () => {
    return (
        <div>
            <p>You have disconnected from the interview.</p>
            <p>Check your internet connection.</p>

            <div className="actionSet">
                <Link to="/">Go back</Link>
            </div>
        </div>
    );
}