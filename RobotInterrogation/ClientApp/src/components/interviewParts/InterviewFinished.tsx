import * as React from 'react';
import { InterviewOutcome } from '../Interview';
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

export class InterviewFinished extends React.PureComponent<IProps> {
    public render() {
        return <div>
            {this.renderOutcome()}
            <div className="actionSet">
                <button onClick={this.props.playAgain} className="btn btn-secondary">Play again</button>
            </div>
        </div>
    }

    private renderOutcome() {
        switch (this.props.outcome) {
            case InterviewOutcome.CorrectlyGuessedHuman:
                return this.props.isInterviewer
                    ? <InterviewerHumanCorrect />
                    : <SuspectHumanCorrect />;

            case InterviewOutcome.CorrectlyGuessedRobot:
                return this.props.isInterviewer
                    ? <InterviewerRobotCorrect role={this.props.role} />
                    : <SuspectRobotCorrect role={this.props.role} />;

            case InterviewOutcome.WronglyGuessedHuman:
                return this.props.isInterviewer
                    ? <InterviewerHumanIncorrect role={this.props.role} />
                    : <SuspectHumanIncorrect role={this.props.role} />;

            case InterviewOutcome.WronglyGuessedRobot:
                return this.props.isInterviewer
                    ? <InterviewerRobotIncorrect />
                    : <SuspectRobotIncorrect />;

            case InterviewOutcome.KilledInterviewer:
                return this.props.isInterviewer
                    ? <InterviewerViolentKilled role={this.props.role} />
                    : <SuspectViolentKilled role={this.props.role} />;

            default:
                return <div>Unknown outcome</div>;
        }
    }
}