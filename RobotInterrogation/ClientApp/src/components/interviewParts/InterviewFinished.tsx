import * as React from 'react';
import { InterviewOutcome, InterviewPosition } from '../interviewReducer';
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
import { ActionSet } from './elements/ActionSet';
import { Page } from './elements/Page';
import { Button } from '@material-ui/core';
import { P } from './elements/P';

interface IProps {
    position: InterviewPosition;
    role: ISuspectRole;
    outcome: InterviewOutcome;
    playAgain: () => void;
}

export const InterviewFinished: React.FunctionComponent<IProps> = props => {
    function renderOutcome() {
        switch (props.outcome) {
            case InterviewOutcome.CorrectlyGuessedHuman:
                return props.position === InterviewPosition.Interviewer
                    ? <InterviewerHumanCorrect />
                    : <SuspectHumanCorrect />;

            case InterviewOutcome.CorrectlyGuessedRobot:
                return props.position === InterviewPosition.Interviewer
                    ? <InterviewerRobotCorrect role={props.role} />
                    : <SuspectRobotCorrect role={props.role} />;

            case InterviewOutcome.WronglyGuessedHuman:
                return props.position === InterviewPosition.Interviewer
                    ? <InterviewerHumanIncorrect role={props.role} />
                    : <SuspectHumanIncorrect role={props.role} />;

            case InterviewOutcome.WronglyGuessedRobot:
                return props.position === InterviewPosition.Interviewer
                    ? <InterviewerRobotIncorrect />
                    : <SuspectRobotIncorrect />;

            case InterviewOutcome.KilledInterviewer:
                return props.position === InterviewPosition.Interviewer
                    ? <InterviewerViolentKilled role={props.role} />
                    : <SuspectViolentKilled role={props.role} />;

            default:
                return <P>Unknown outcome</P>;
        }
    }

    return (
        <Page>
            {renderOutcome()}
            <ActionSet>
                <Button variant="outlined" onClick={props.playAgain}>Play again</Button>
            </ActionSet>
        </Page>
    );
}