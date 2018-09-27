import * as React from 'react';

interface IProps {
    role: string,
    waitFor: string,
}

export class Wait extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the {this.props.role}.</h2>
            <p>Wait for {this.props.waitFor}.</p>
        </div>
    }
}