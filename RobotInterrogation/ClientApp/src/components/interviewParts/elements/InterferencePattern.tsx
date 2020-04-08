import * as React from 'react';
import './Interference.css';

interface IProps {
    pattern: string;
}

export const InterferencePattern: React.FunctionComponent<IProps> = props => {
    return (
        <div className="interference">
            {props.pattern}
        </div>
    )
}