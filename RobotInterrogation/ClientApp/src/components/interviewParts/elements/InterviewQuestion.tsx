import * as React from 'react';
import './InterviewQuestion.css';

export interface IInterviewQuestion {
    challenge: string;
    examples: string[]
}

interface IProps {
    primary: boolean;
    question: IInterviewQuestion;
}

export class InterviewQuestion extends React.PureComponent<IProps, {}> {
    public render() {
        const classes = `interviewQuestion interviewQuestion--${this.props.primary ? 'primary' : 'secondary'}`;
        const examples = this.props.question.examples.map((q, i) => <li className="interviewQuestion__example" key={i}>{q}</li>);
        const secondary = this.props.primary ? undefined : <div className="interviewQuestion__secondaryWrapper">while fulfilling another prompt</div>

        return <div className={classes}>
            <div className="interviewQuestion__wrapper">Suspect must</div>
            {secondary}
            <div className="interviewQuestion__text">
                {this.props.question.challenge}
            </div>
            <ul className="interviewQuestion__examples">
                {examples}
            </ul>
            <div className="interviewQuestion__wrapper">to be human</div>
        </div>;
    }
}
