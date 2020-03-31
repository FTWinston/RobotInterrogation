import * as React from 'react';
import { renderOptions } from './renderOptions';
import { ISuspectRole, SuspectRole } from './elements/SuspectRole';

interface IProps {
    options: string[],
    role: ISuspectRole;
    action: (index: number) => void,
}

export class SuspectNoteSelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the suspect.</h2>

            <SuspectRole role={this.props.role} />

            <p>Select one of the following suspect notes:</p>

            {renderOptions(this.props.options, this.props.action)}
        </div>
    }
}