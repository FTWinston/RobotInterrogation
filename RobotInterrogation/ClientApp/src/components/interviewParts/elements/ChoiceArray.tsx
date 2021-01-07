import * as React from 'react';
import { Button } from '@material-ui/core';
import { Choice } from './Choice';

interface IProps {
    options: string[];
    action?: (index: number) => void;
}

export const ChoiceArray: React.FunctionComponent<IProps> = props => {
    const options = props.options.map((val: string, index: number) => {
        const onClick = props.action ? () => props.action!(index) : undefined;
        return <Button key={index} onClick={onClick}>{val}</Button>
    });

    return (
        <Choice>
            {options}
        </Choice>
    )
}