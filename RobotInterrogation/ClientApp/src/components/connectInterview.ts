import { connectSignalR } from 'src/Connectivity';
import { Dispatch } from 'react';
import { InterviewAction, InterviewOutcome } from './interviewReducer';
import { ISuspectRole } from './interviewParts/elements/SuspectRole';
import { IInterviewQuestion } from './interviewParts/elements/InterviewQuestion';

export async function connectInterview(session: string, dispatch: Dispatch<InterviewAction>) {
    const connection = connectSignalR('/hub/Interview');

    connection.on('SetRole', (isInterviewer: boolean) => {
        dispatch({
            type: 'set position',
            isInterviewer,
        });
    });

    connection.on('SetWaitingForPlayer', () => {
        dispatch({
            type: 'set waiting for opponent',
        });
    });

    connection.on('SetPlayersPresent', () => {
        dispatch({
            type: 'set selecting positions',
        });
    });

    connection.on('SwapPositions', () => {
        dispatch({
            type: 'swap position'
        });
    });

    connection.on('ShowPenaltyChoice', (options: string[]) => {
        dispatch({
            type: 'set penalty choice',
            options,
        });
    });

    connection.on('WaitForPenaltyChoice', () => {
        dispatch({
            type: 'set penalty choice',
            options: [],
        });
    });

    connection.on('SetPenalty', (penalty: string) => {
        dispatch({
            type: 'set penalty',
            penalty,
        });
    });

    connection.on('ShowPacketChoice', (options: string[]) => {
        dispatch({
            type: 'set packet choice',
            options,
        });
    });

    connection.on('WaitForPacketChoice', () => {
        dispatch({
            type: 'set packet choice',
            options: [],
        });
    });

    connection.on('SetPacket', (packet: string, prompt: string) => {
        dispatch({
            type: 'set packet',
            packet,
            prompt,
        });
    });

    connection.on('ShowRole', (role: ISuspectRole) => {
        dispatch({
            type: 'set role',
            role,
        });
    });

    connection.on('ShowQuestions', (primary: IInterviewQuestion[], secondary: IInterviewQuestion[]) => {
        dispatch({
            type: 'set questions',
            primary,
            secondary,
        });
    });

    connection.on('ShowSuspectBackgroundChoice', (options: string[]) => {
        dispatch({
            type: 'set background choice',
            options,
        });
    });

    connection.on('WaitForSuspectBackgroundChoice', () => {
        dispatch({
            type: 'set background choice',
            options: [],
        });
    });

    connection.on('SetSuspectBackground', (note: string) => {
        dispatch({
            type: 'set background',
            background: note,
        });
    });

    connection.on('StartTimer', (duration: number) => {
        dispatch({
            type: 'start timer',
            duration,                
        });
    })

    connection.on('EndGame', (outcome: InterviewOutcome, role: ISuspectRole) => {
        dispatch({
            type: 'end game',
            outcome,
            role,
        })
    })

    connection.onclose((error?: Error) => {
        /*
        if (error !== undefined) {
            console.log('Connection error:', error);
        }
        else {
            console.log('Unspecified connection error');
        }
        */

        dispatch({
            type: 'disconnect',
        });
    });

    await connection.start();

    const ok = await connection.invoke('Join', session)

    if (!ok) {
        dispatch({
            type: 'invalid session',
        });

        await connection.stop();
    }

    return connection;
}