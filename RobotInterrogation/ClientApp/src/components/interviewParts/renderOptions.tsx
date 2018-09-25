import * as React from 'react';

export const renderOptions = (options: string[], action: (index: number) => void) => {
    const optionDisplay = options.map((val: string, index: number) => {
        const onClick = () => action(index);
        return <li key={index}><button className="btn" onClick={onClick}>{val}</button></li>
    });

    return <ol>{optionDisplay}</ol>
};