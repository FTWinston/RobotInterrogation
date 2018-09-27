import * as React from 'react';

interface IProps {
    stay: () => void,
    swap: () => void,
}

export class InterviewerPositionSelection extends React.PureComponent<IProps> {
    public render() {
        return <div>
            <h2>You are the interviewer.</h2>

            <p>Please select an option:</p>

            <button onClick={this.props.stay}>Remain as the interviewer</button>
            <br />
            <button onClick={this.props.swap}>Switch roles and become the suspect</button>
        </div>
    }
}