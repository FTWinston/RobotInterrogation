import * as React from 'react';
import './InterviewQuestion.css';

interface IProps {
    primary: boolean;
    question: string;
}

export class InterviewQuestion extends React.PureComponent<IProps, {}> {
    public render() {
        const classes = 'interviewQuestion interviewQuestion--' + this.props.primary ? 'primary' : 'secondary';

        return <div className={classes}>
            <div className="interviewQuestion__text">
                {this.props.question}
            </div>
        </div>;
    }
}
