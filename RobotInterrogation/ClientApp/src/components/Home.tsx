import * as React from 'react';
import { Link } from 'react-router-dom';

export class Home extends React.PureComponent {
    public render() {
        return <div>
            <h1>Robot Interrogation</h1>
            <p className="lead">Can <em>you</em> tell if someone is secretly a robot?</p>

            <ul>
                <li><Link to="/rules">Rules</Link></li>
                <li><Link to="/host">Host a game</Link></li>
            </ul>
        </div>;
    }
}
