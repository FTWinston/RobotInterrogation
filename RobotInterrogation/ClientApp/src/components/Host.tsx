import * as React from 'react';
import { Redirect } from 'react-router';
import { queryString } from '../Connectivity';
import { useState, useEffect } from 'react';

export const Host: React.FunctionComponent = () => {
    const [interviewId, setInterviewId] = useState<string>();
    
    useEffect(
        () => {
            const query = async () => {
                const id = await queryString('/api/Data/GetNextSessionID')
                setInterviewId(id);
            }
            query();
        },
        []
    );
    
    if (interviewId !== undefined) {
        return <Redirect to={`/interview/${interviewId}`} />
    }

    return (
        <div>
            Please wait...
        </div>
    );
}