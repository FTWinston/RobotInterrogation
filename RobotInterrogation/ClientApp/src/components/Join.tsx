import * as React from 'react';
import { Link } from 'react-router-dom';

export class Join extends React.PureComponent {
    public render() {
        return <div>
            <p>
                You'll need to enter the name of the game you wish to join HERE...
                Once that's possible to do.
            </p>

            <Link to="/">Go back</Link>
        </div>;
    }
}
