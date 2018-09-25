import * as React from 'react';

interface IProps {
    role: string,
    waitFor: string,
}

export class Wait extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">You are the {this.props.role}.</p>
            <p>Please wait for {this.props.waitFor}.</p>
        </div>
    }
}