import { ISuspectRole } from "./interviewParts/elements/SuspectRole";
import { IInterviewQuestion } from "./interviewParts/elements/InterviewQuestion";

export enum InterviewStatus {
    NotConnected,
    Disconnected,
    InvalidSession,
    WaitingForOpponent,

    SelectingPositions,
    RoleConfirmed,

    PenaltySelection,
    ShowingPenalty,

    PacketSelection,
    ShowingPacket,

    BackgroundSelection,

    ReadyToStart,
    InProgress,

    Finished,
}

export enum InterviewOutcome {
    Disconnected = 0,
    CorrectlyGuessedHuman,
    WronglyGuessedHuman,
    CorrectlyGuessedRobot,
    WronglyGuessedRobot,
    KilledInterviewer,
}

export interface IInterviewState {
    isInterviewer: boolean;
    status: InterviewStatus;
    outcome?: InterviewOutcome;
    choice: string[];
    packet: string;
    prompt: string;
    penalty: string;
    primaryQuestions: IInterviewQuestion[];
    secondaryQuestions: IInterviewQuestion[];
    suspectNote: string;
    role?: ISuspectRole;
    duration: number;
}

export const initialState: IInterviewState = {
    choice: [],
    duration: 0,
    isInterviewer: false,
    packet: '',
    penalty: '',
    primaryQuestions: [],
    prompt: '',
    secondaryQuestions: [],
    status: InterviewStatus.NotConnected,
    suspectNote: '',
};

export type InterviewAction = {
    type: 'set position';
    isInterviewer: boolean;
} | {
    type: 'swap position';
} | {
    type: 'set waiting for opponent';
} | {
    type: 'set selecting positions';
} | {
    type: 'set penalty choice';
    options: string[]
} | {
    type: 'set penalty';
    penalty: string;
} | {
    type: 'set packet choice';
    options: string[];
} | {
    type: 'set packet';
    packet: string;
    prompt: string;
} | {
    type: 'set role';
    role: ISuspectRole;
} | {
    type: 'set questions';
    primary: IInterviewQuestion[];
    secondary: IInterviewQuestion[];
} | {
    type: 'set background choice';
    options: string[];
} | {
    type: 'set background';
    background: string;
} | {
    type: 'start timer';
    duration: number;
} | {
    type: 'end game';
    outcome: InterviewOutcome;
    role: ISuspectRole;
} | {
    type: 'disconnect';
} | {
    type: 'invalid session';
}

export function interviewReducer(state: IInterviewState, action: InterviewAction): IInterviewState {
    switch (action.type) {
        case 'set position':
            return {
                ...state,
                isInterviewer: action.isInterviewer,
            };

        case 'swap position':
            return {
                ...state,
                isInterviewer: !state.isInterviewer,
            };
            
        case 'set waiting for opponent':
            return {
                ...state,
                status: InterviewStatus.WaitingForOpponent,
            };

        case 'set selecting positions':
            return {
                ...state,
                status: InterviewStatus.SelectingPositions,

                // clear any data from previous game
                choice: [],
                duration: 0,
                outcome: undefined,
                packet: '',
                penalty: '',
                primaryQuestions: [],
                prompt: '',
                role: undefined,
                secondaryQuestions: [],
                suspectNote: '',
            };
            
        case 'set penalty choice':
            return {
                ...state,
                status: InterviewStatus.PenaltySelection,
                choice: action.options,
            };

        case 'set penalty':
            return {
                ...state,
                status: InterviewStatus.ShowingPenalty,
                penalty: action.penalty,
                choice: [],
            };

        case 'set packet choice':
            return {
                ...state,
                status: InterviewStatus.PacketSelection,
                choice: action.options,
            };
            
        case 'set packet':
            return {
                ...state,
                status: InterviewStatus.ShowingPacket,
                packet: action.packet,
                prompt: action.prompt,
                choice: [],
            };

        case 'set role':
            return {
                ...state,
                role: action.role,
            };
        
        case 'set questions':
            return {
                ...state,
                status: InterviewStatus.BackgroundSelection,
                primaryQuestions: action.primary,
                secondaryQuestions: action.secondary,
            };

        case 'set background choice':
            return {
                ...state,
                status: InterviewStatus.BackgroundSelection,
                choice: action.options,
            };

        case 'set background':
            return {
                ...state,
                status: InterviewStatus.ReadyToStart,
                suspectNote: action.background,
            };

        case 'start timer':
            return {
                ...state,
                status: InterviewStatus.InProgress,
                duration: action.duration,
            };
            
        case 'end game':
            return {
                ...state,
                status: InterviewStatus.Finished,
                outcome: action.outcome,
                role: action.role,
            };

        case 'disconnect':
            return {
                ...state,
                status: InterviewStatus.Disconnected,
            };
            
        case 'invalid session':
            return {
                ...state,
                status: InterviewStatus.InvalidSession,
            };
    }
}