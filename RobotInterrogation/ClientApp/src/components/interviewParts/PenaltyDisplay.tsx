import * as React from 'react';
import './ValueDisplay.css';

interface IProps {
    role: string;
    penalty: string;
}

export class PenaltyDisplay extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the {this.props.role}.</h2>

            <p>The chosen penality is:</p>
            <p className="valueDisplay">{this.props.penalty}</p>
        </div>
    }
}