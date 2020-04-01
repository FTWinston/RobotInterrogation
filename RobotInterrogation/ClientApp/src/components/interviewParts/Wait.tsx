import * as React from 'react';

interface IProps {
    role: string,
    waitFor: string,
}

export const Wait: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the {props.role}.</h2>
            <p>Wait for {props.waitFor}.</p>
        </div>
    );
}