import * as React from 'react';
import './Interference.css';
import { Direction } from 'src/components/interviewReducer';

interface IProps {
    connections: Direction[][];
    content: string[][];
}

export const InterferencePattern: React.FunctionComponent<IProps> = props => {
    const transposeContent = props.content[0].map((_, c) => props.content.map(row => row[c]));

    const rows = transposeContent.map((row, y) => {
        const cells = row.map((val, x) => {
            const classes = determineCellClasses(props.connections[x][y], x === 0, y === 0);
            return <td key={x} className={classes}>{val}</td>
        });

        return (
            <tr key={y}>{cells}</tr>
        )
    });

    return (
        <div className="interference interference--pattern">
            <table>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}

function determineCellClasses(connections: Direction, leftmost: boolean, topmost: boolean) {
    let classes = 'interference__cell';

    if (topmost) {
        classes += ' interference__cell--northBorder';
    }

    if (leftmost) {
        classes += ' interference__cell--westBorder';
    }

    if ((connections & Direction.South) === 0) {
        classes += ' interference__cell--southBorder';
    }
    if ((connections & Direction.East) === 0) {
        classes += ' interference__cell--eastBorder';
    }

    return classes;
}