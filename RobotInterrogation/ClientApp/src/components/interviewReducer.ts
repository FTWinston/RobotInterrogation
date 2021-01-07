import { ISuspectRole } from './interviewParts/elements/SuspectRole';
import { IInterviewQuestion } from './interviewParts/elements/InterviewQuestion';

export enum InterviewStatus {
    NotConnected,
    Disconnected,
    InvalidSession,
    WaitingForOpponent,

    SelectingPositions,
    RoleConfirmed,

    PenaltySelection,
    PenaltyCalibration,

    PacketSelection,
    
    InducerPrompt,
    ShowingInducer,

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

export enum InterviewPosition {
    Interviewer,
    Suspect,
    Spectator,
    None,
}

export enum Direction {
    None = 0,
    North = 1 << 0,
    South = 1 << 1,
    East = 1 << 2,
    West = 1 << 3,
}

export interface IPacket {
    name: string;
    difficulty: string;
    icon: string;
}

export interface IInterviewState {
    position: InterviewPosition;
    turn: InterviewPosition;
    status: InterviewStatus;
    outcome?: InterviewOutcome;
    choice: string[];
    packet: string;
    packets?: IPacket[];
    prompt: string;
    penalty: string;
    patternConnections?: Direction[][];
    patternContent?: string[][];
    patternSolution?: string[];
    questions: IInterviewQuestion[];
    suspectBackground: string;
    role?: ISuspectRole;
    duration: number;
}

export const initialState: IInterviewState = {
    choice: [],
    duration: 0,
    position: InterviewPosition.None,
    turn: InterviewPosition.Interviewer,
    packet: '',
    penalty: '',
    prompt: '',
    questions: [],
    status: InterviewStatus.NotConnected,
    suspectBackground: '',
};

export type InterviewAction = {
    type: 'set position';
    position: number;
} | {
    type: 'swap position';
} | {
    type: 'set waiting for opponent';
} | {
    type: 'set selecting positions';
} | {
    type: 'set penalty choice';
    options: string[]
    turn?: number
} | {
    type: 'set penalty';
    penalty: string;
} | {
    type: 'set packet choice';
    options: IPacket[];
} | {
    type: 'set packet';
    packet: string;
    prompt: string;
} | {
    type: 'prompt inducer';
    solution: string[];
} | {
    type: 'spectator wait inducer';
    role: ISuspectRole;
    solution: string[];
    patternConnections?: number[][];
    patternContent?: string[][];
} | {
    type: 'set role and pattern';
    role: ISuspectRole;
    patternConnections: Direction[][];
    patternContent: string[][];
} | {
    type: 'set role and solution';
    role: ISuspectRole;
    solution: string[];
} | {
    type: 'show inducer';
} | {
    type: 'set questions';
    questions: IInterviewQuestion[];
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
                position: action.position,
            };

        case 'swap position':
            return {
                ...state,
                position: [InterviewPosition.Suspect, InterviewPosition.Interviewer, InterviewPosition.Spectator][state.position],
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
                packets: [],
                penalty: '',
                prompt: '',
                patternConnections: undefined,
                patternContent: undefined,
                patternSolution: undefined,
                questions: [],
                role: undefined,
                suspectBackground: '',
            };
            
        case 'set penalty choice':
            return {
                ...state,
                status: InterviewStatus.PenaltySelection,
                choice: action.options,
                turn: action.turn === undefined ? InterviewPosition.Interviewer : action.turn,
            };

        case 'set penalty':
            return {
                ...state,
                status: InterviewStatus.PenaltyCalibration,
                penalty: action.penalty,
                choice: [],
            };

        case 'set packet choice':
            return {
                ...state,
                status: InterviewStatus.PacketSelection,
                packets: action.options,
            };
            
        case 'set packet':
            return {
                ...state,
                packet: action.packet,
                prompt: action.prompt,
                choice: [],
                packets: [],
            };

        case 'prompt inducer':
            return {
                ...state,
                status: InterviewStatus.InducerPrompt,
                patternSolution: action.solution.length > 0 ? action.solution : undefined,
            };

        case 'spectator wait inducer':
            return {
                ...state,
                status: InterviewStatus.InducerPrompt,
                role: action.role,
                patternSolution: action.solution.length > 0 ? action.solution : undefined,
                patternConnections: action.patternConnections,
                patternContent: action.patternContent,
            };

        case 'set role and pattern':
            return {
                ...state,
                role: action.role,
                patternConnections: action.patternConnections,
                patternContent: action.patternContent,
            };
        
        case 'set role and solution':
            return {
                ...state,
                role: action.role,
                patternSolution: action.solution,
            };
        
        case 'set questions':
            return {
                ...state,
                questions: action.questions,
            };
        
        case 'show inducer':
            return {
                ...state,
                status: InterviewStatus.ShowingInducer,
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
                suspectBackground: action.background,
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