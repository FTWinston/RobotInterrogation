import * as React from 'react';
import { Link } from 'react-router-dom';

export class Rules extends React.PureComponent {
    public render() {
        return <div>
            <h1>Robot Interrogation</h1>

            <p>This game is a conversation between two players, an interviewer and a suspect. It is best played by two people in the same room, though playing via video chat also works.</p>

            <p>The suspect must convince the interviewer that they are human. The interviewer must determine whether they are a robot.</p>

            <p>Robots have strange personality quirks, but then so do humans under pressure...</p>

            <p>This app is based on <a href="https://www.kickstarter.com/projects/tommy-maranges/inhuman-conditions-a-game-of-cops-and-robots">Inhuman Conditions</a>, a game by Tommy Manarges and Cory O'Brien whose <a href="https://www.dropbox.com/s/sagi621ht1fnu2x/Inhuman%20Conditions%20Rules%20%28Public%20File%29.pdf">rules are available here</a>. Read them before you play.</p>

            <p>If you're interested, you can <a href="https://github.com/FTWinston/RobotInterrogation">view the source</a> of this project on GitHub.</p>

            <div className="actionSet">
                <Link to="/">Go back</Link>
            </div>
        </div>;
    }
}
