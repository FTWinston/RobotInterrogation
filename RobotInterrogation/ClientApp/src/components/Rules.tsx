import * as React from 'react';
import { Link } from 'react-router-dom';

export class Rules extends React.PureComponent {
    public render() {
        return <div>
            <h1>Robot Interrogation</h1>
            
            <p>This app is based on Inhuman Conditions, a game by Tommy Manarges and Cory O'Brien whose <a href="https://www.dropbox.com/s/sagi621ht1fnu2x/Inhuman%20Conditions%20Rules%20%28Public%20File%29.pdf">rules are available here</a>.</p>

            <Link to="/">Go back</Link>
        </div>;
    }
}
