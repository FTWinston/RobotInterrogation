import * as React from 'react';
import { Link } from 'react-router-dom';
import { ActionSet } from './elements/ActionSet';

export const OpponentDisconnected: React.FunctionComponent = () => {
    return (
        <div>
            <p className="lead">Your opponent disconnected from the interview.</p>

            <ActionSet>
                <Link to="/">Go back</Link>
            </ActionSet>
        </div>
    );
}