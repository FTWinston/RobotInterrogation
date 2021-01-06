import * as React from 'react';
import { InterviewOutcome, InterviewPosition } from '../interviewReducer';
import { ISuspectRole } from './elements/SuspectRole';
import { ActionSet } from './elements/ActionSet';
import { Page } from './elements/Page';
import { Button } from '@material-ui/core';
import { P } from './elements/P';
import { OutcomeHumanCorrect } from './OutcomeHumanCorrect';
import { OutcomeRobotCorrect } from './OutcomeRobotCorrect';
import { OutcomeHumanIncorrect } from './OutcomeHumanIncorrect';
import { OutcomeRobotIncorrect } from './OutcomeRobotIncorrect';
import { OutcomeViolentKilled } from './OutcomeViolentKilled';

interface IProps {
    position: InterviewPosition;
    role: ISuspectRole;
    outcome: InterviewOutcome;
    playAgain: () => void;
}

export const InterviewFinished: React.FunctionComponent<IProps> = props => {
    const playAgain = props.position === InterviewPosition.Interviewer || props.position === InterviewPosition.Suspect
        ? <ActionSet>
            <Button variant="outlined" onClick={props.playAgain}>Play again</Button>
        </ActionSet>
        : undefined;

    function renderOutcome() {
        switch (props.outcome) {
            case InterviewOutcome.CorrectlyGuessedHuman:
                return <OutcomeHumanCorrect position={props.position} />;

            case InterviewOutcome.CorrectlyGuessedRobot:
                return <OutcomeRobotCorrect position={props.position} role={props.role} />;

            case InterviewOutcome.WronglyGuessedHuman:
                return <OutcomeHumanIncorrect position={props.position} role={props.role} />;

            case InterviewOutcome.WronglyGuessedRobot:
                return <OutcomeRobotIncorrect position={props.position} />;

            case InterviewOutcome.KilledInterviewer:
                return <OutcomeViolentKilled position={props.position} role={props.role} />;

            default:
                return <P>Unknown outcome</P>;
        }
    }

    return (
        <Page>
            {renderOutcome()}
            {playAgain}
        </Page>
    );
}