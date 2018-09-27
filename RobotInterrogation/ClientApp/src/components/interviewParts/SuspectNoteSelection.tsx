import * as React from 'react';
import { renderOptions } from './renderOptions';

interface IProps {
    options: string[],
    action: (index: number) => void,
}

export class SuspectNoteSelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the suspect.</h2>
            <p>Select one of the following suspect notes:</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}