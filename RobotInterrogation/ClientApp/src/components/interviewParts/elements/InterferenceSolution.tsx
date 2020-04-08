import * as React from 'react';
import './Interference.css';

interface IProps {
    solution: string[];
}

export const InterferenceSolution: React.FunctionComponent<IProps> = props => {

    const text = props.solution.join('→');
    const spacing = Array(text.length).fill('─').join('');

    return (
        <div className="interference">
            ┌→{text}→┐<br/>
            └←{spacing}←┘
        </div>
    )
}