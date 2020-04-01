import * as React from 'react';
import { InterviewOutcome } from '../interviewReducer';
import './ActionSet.css';
import { ISuspectRole } from './elements/SuspectRole';
import { InterviewerHumanCorrect } from './InterviewerHumanCorrect';
import { InterviewerHumanIncorrect } from './InterviewerHumanIncorrect';
import { InterviewerRobotCorrect } from './InterviewerRobotCorrect';
import { InterviewerRobotIncorrect } from './InterviewerRobotIncorrect';
import { InterviewerViolentKilled } from './InterviewerViolentKilled';
import { SuspectHumanCorrect } from './SuspectHumanCorrect';
import { SuspectHumanIncorrect } from './SuspectHumanIncorrect';
import { SuspectRobotCorrect } from './SuspectRobotCorrect';
import { SuspectRobotIncorrect } from './SuspectRobotIncorrect';
import { SuspectViolentKilled } from './SuspectViolentKilled';

interface IProps {
    isInterviewer: boolean;
    role: ISuspectRole;
    outcome: InterviewOutcome;
    playAgain: () => void;
}

export const InterviewFinished: React.FunctionComponent<IProps> = props => {
    function renderOutcome() {
        switch (props.outcome) {
            case InterviewOutcome.CorrectlyGuessedHuman:
                return props.isInterviewer
                    ? <InterviewerHumanCorrect />
                    : <SuspectHumanCorrect />;

            case InterviewOutcome.CorrectlyGuessedRobot:
                return props.isInterviewer
                    ? <InterviewerRobotCorrect role={props.role} />
                    : <SuspectRobotCorrect role={props.role} />;

            case InterviewOutcome.WronglyGuessedHuman:
                return props.isInterviewer
                    ? <InterviewerHumanIncorrect role={props.role} />
                    : <SuspectHumanIncorrect role={props.role} />;

            case InterviewOutcome.WronglyGuessedRobot:
                return props.isInterviewer
                    ? <InterviewerRobotIncorrect />
                    : <SuspectRobotIncorrect />;

            case InterviewOutcome.KilledInterviewer:
                return props.isInterviewer
                    ? <InterviewerViolentKilled role={props.role} />
                    : <SuspectViolentKilled role={props.role} />;

            default:
                return <div>Unknown outcome</div>;
        }
    }

    return (
        <div>
            {renderOutcome()}
            <div className="actionSet">
                <button onClick={props.playAgain} className="btn btn-secondary">Play again</button>
            </div>
        </div>
    );
}