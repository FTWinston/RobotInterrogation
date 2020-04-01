import * as React from 'react';
import { Link } from 'react-router-dom';
import { inCompatibilityMode, setCompatibilityMode } from 'src/Connectivity';
import { useState } from 'react';

export const About: React.FunctionComponent = () => {
    const [toggle, setToggle] = useState(false);

    const toggleCompatibility = () => {
        setCompatibilityMode(!inCompatibilityMode());
        setToggle(!toggle);
    }

    const toggleText = inCompatibilityMode()
        ? 'Disable compatibility mode'
        : 'Enable compatibility mode';

    return (
        <div>
            <h1>Robot Interrogation</h1>

            <p>This game is a conversation between two players, an interviewer and a suspect. It is best played by two people in the same room, though playing via video chat also works.</p>

            <p>The suspect must convince the interviewer that they are human. The interviewer must determine whether they are a robot.</p>

            <p>Robots have strange personality quirks, but then so do humans under pressure...</p>

            <p>This app is based on <a href="https://robots.management">Inhuman Conditions</a>, a game by Tommy Manarges and Cory O'Brien whose <a href="https://www.dropbox.com/s/9ledq11mc3nd15f/Inhuman%20Conditions%20Rulebooks%20%28Public%20File%29.pdf?dl=0">rules are available here</a>. Read them before you play.</p>

            <p>If you're interested, you can <a href="https://github.com/FTWinston/RobotInterrogation">view the source</a> of this project on GitHub. Report any problems there.</p>

            <div className="actionSet">
                <Link to="/">Go back</Link>
            </div>

            <div className="compatibilityPrompt">
                Connection problems?&nbsp;
                <button onClick={toggleCompatibility}>{toggleText}</button>
            </div>
        </div>
    )
}
