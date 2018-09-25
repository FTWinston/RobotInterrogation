import * as React from 'react';

interface IProps {
    stay: () => void,
    swap: () => void,
}

export class InterviewerPositionSelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <p className="lead">You are the interviewer.</p>

            <p>Please select an option:</p>

            <button className="btn btn-primary" onClick={this.props.stay}>Remain as the interviewer</button>
            <button className="btn btn-secondary" onClick={this.props.swap}>Switch roles and become the suspect</button>
        </div>
    }
}