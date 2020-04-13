import * as React from 'react';
import { Link } from 'react-router-dom';
import { ActionSet } from './elements/ActionSet';

export const Disconnected: React.FunctionComponent = () => {
    return (
        <div>
            <p>You have disconnected from the interview.</p>
            <p>Check your internet connection.</p>

            <ActionSet>
                <Link to="/">Go back</Link>
            </ActionSet>
        </div>
    );
}