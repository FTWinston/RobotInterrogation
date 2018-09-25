import * as React from 'react';

interface IProps {
    role: string;
    penalty: string;
}

export class PenaltyDisplay extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p> You are the {this.props.role}. The chosen penality is:</p>
            <p className="text-large">{this.props.penalty}</p>
        </div>
    }
}