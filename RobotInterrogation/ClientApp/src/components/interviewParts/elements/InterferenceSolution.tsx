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
        .reverse();
    
    if (secondHalf.length < firstHalf.length) {
        secondHalf.splice(1, 0, '');
    }

    const firstRow: JSX.Element[] = [];
    const midRow: JSX.Element[] = [];
    const lastRow: JSX.Element[] = [];

    for (let i = 0; i < firstHalf.length; i++) {
        firstRow.push(<td key={i * 2} className="interference__cell">{firstHalf[i]}</td>);
        lastRow.push(<td key={i * 2} className="interference__cell">{secondHalf[i]}</td>);

        if (i < firstHalf.length - 1) {
            firstRow.push(<td key={i * 2 + 1} className="interference__cell">→</td>);
            lastRow.push(<td key={i * 2 + 1} className="interference__cell">←</td>);
        }

        if (i < firstHalf.length - 2) {
            midRow.push(<td key={i * 2} className="interference__cell" />)
            midRow.push(<td key={i * 2 + 1} className="interference__cell" />)
        }
    }

    return (
        <div className="interference interference--solution">
            <table>
                <tbody>
                    <tr>{firstRow}</tr>
                    <tr>
                        <td className="interference__cell">↑</td>
                        <td className="interference__cell"/>
                        {midRow}
                        <td className="interference__cell">↓</td>
                    </tr>
                    <tr>{lastRow}</tr>
                </tbody>
            </table>
        </div>
    )
}