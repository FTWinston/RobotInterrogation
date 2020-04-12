import * as React from 'react';
import './InterviewQuestion.css';

export interface IInterviewQuestion {
    challenge: string;
    examples: string[];
    isPrimary: boolean;
}

interface IProps {
    question: IInterviewQuestion;
    sortUp?: () => void;
    sortDown?: () => void;
}

export const InterviewQuestion = React.forwardRef<HTMLDivElement, IProps>((props, ref) => {
    const classes = `interviewQuestion interviewQuestion--${props.question.isPrimary ? 'primary' : 'secondary'}`;
    const examples = props.question.examples.map((q, i) => <li className="interviewQuestion__example" key={i}>{q}</li>);
    const secondary = props.question.isPrimary
        ? undefined
        : <div className="interviewQuestion__secondaryWrapper">while fulfilling another prompt</div>

    const sortUp = props.sortUp
        ? <button
            className="interviewQuestion__sort interviewQuestion__sort--up"
            onClick={props.sortUp}
        >↑</button>
        : undefined;

    const sortDown = props.sortDown
        ? <button
            className="interviewQuestion__sort interviewQuestion__sort--down"
            onClick={props.sortDown}
        >↓</button>
        : undefined;

    return (
        <div className={classes} ref={ref}>
            <div className="interviewQuestion__wrapper">Suspect must</div>
            {secondary}
            <div className="interviewQuestion__text">
                {props.question.challenge}
            </div>
            <ul className="interviewQuestion__examples">
                {examples}
            </ul>
            <div className="interviewQuestion__wrapper">to be human</div>
            {sortUp}
            {sortDown}
        </div>
    );
})
