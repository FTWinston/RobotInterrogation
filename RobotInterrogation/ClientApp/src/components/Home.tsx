import * as React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FunctionComponent = () => {
    return (
        <div className="page">
            <h1>Robot Interrogation</h1>
            <p>Can <em>you</em> tell if someone is secretly a robot?</p>

            <p>Play with a friend, either in the same room or via video chat.</p>

            <div className="actionSet">
                <Link to="/about">Information</Link>
                <Link to="/host">Start a game</Link>
            </div>
        </div>
    );
}
