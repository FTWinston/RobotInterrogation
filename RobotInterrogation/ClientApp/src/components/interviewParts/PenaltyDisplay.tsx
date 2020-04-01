import * as React from 'react';
import './ValueDisplay.css';

interface IProps {
    role: string;
    penalty: string;
}

export const PenaltyDisplay: React.FunctionComponent<IProps> = props => {
    return (
        <div>
            <h2>You are the {props.role}.</h2>

            <p>The chosen penality is:</p>
            <p className="valueDisplay">{props.penalty}</p>
        </div>
    )
}