import * as React from 'react';
import './Interference.css';

interface IProps {
    solution: string[];
}

export const InterferenceSolution: React.FunctionComponent<IProps> = props => {

    const splitAt = Math.ceil(props.solution.length / 2);

    const firstHalf = props.solution
        .slice(0, splitAt);
    
    const secondHalf = props.solution
        .slice(splitAt)
        .reverse()
    
    if (secondHalf.length < firstHalf.length) {
        secondHalf.splice(1, 0, '');
    }

    const firstLine = firstHalf.join(' → ');
    const lastLine = secondHalf.join(' ← ');

    const midLine = Array(firstLine.length - 2)
        .fill(' ')
        .join('');

    return (
        <div className="interference">
{firstLine}<br/>
↑{midLine}↓<br/>
{lastLine}
</div>
    )
}