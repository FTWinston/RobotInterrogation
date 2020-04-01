import * as React from 'react';

interface IProps {
    stay: () => void,
    swap: () => void,
}

export const InterviewerPositionSelection: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the interviewer.</h2>

            <p>Please select an option:</p>

            <button onClick={props.stay}>Remain as the interviewer</button>
            <br />
            <button onClick={props.swap}>Switch roles and become the suspect</button>
        </div>
    );
}