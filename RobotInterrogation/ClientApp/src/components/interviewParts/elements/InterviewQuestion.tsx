import * as React from 'react';
import { Button, Card, CardContent, Typography, makeStyles } from '@material-ui/core';

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

const useStyles = makeStyles(theme => ({
    root: {
        position: 'relative',
        marginBottom: '1em',
    },
    rootPrimary: {
        
    },
    rootSecondary: {
        backgroundColor: '#eee',
    },
    prefix: {
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    suffix: {
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        position: 'relative',
        top: '0.25em',
    },
    secondary: {
        textAlign: 'center',
        fontStyle: 'italic',
        textTransform: 'uppercase',
    },
    challenge: {
        marginTop: '0.25em',
    },
    examples: {
        margin: '0.5em 0',
        fontStyle: 'italic',
    },
    example: {

    },
    sortUp: {
        position: 'absolute',
        right: '0',
        top: '0',
    },
    sortDown: {
        position: 'absolute',
        bottom: '0',
        right: '0',
    }
}));

export const InterviewQuestion = React.forwardRef<HTMLDivElement, IProps>((props, ref) => {
    const classes = useStyles();

    const rootClasses = props.question.isPrimary
        ? `${classes.root} ${classes.rootPrimary}`
        : `${classes.root} ${classes.rootSecondary}`;

    const examples = props.question.examples.map((q, i) => <Typography component="li" className={classes.example} key={i}>{q}</Typography>);
    const secondary = props.question.isPrimary
        ? undefined
        : <Typography variant="body2" className={classes.secondary} color="textSecondary">while fulfilling another prompt</Typography>

    const sortUp = props.sortUp
        ? <Button
            variant="text"
            className={classes.sortUp}
            onClick={props.sortUp}
        >↑</Button>
        : undefined;

    const sortDown = props.sortDown
        ? <Button
            variant="text"
            className={classes.sortDown}
            onClick={props.sortDown}
        >↓</Button>
        : undefined;

    return (
        <Card className={rootClasses} ref={ref} variant="outlined">
            <CardContent>
                <Typography variant="body2" className={classes.prefix} color="textSecondary">Suspect must</Typography>
                {secondary}
                <Typography className={classes.challenge}>
                    {props.question.challenge}, e.g.
                </Typography>
                <ul className={classes.examples}>
                    {examples}
                </ul>
                <Typography variant="body2" className={classes.suffix} color="textSecondary">to be human</Typography>
                {sortUp}
                {sortDown}
            </CardContent>
            <div />
        </Card>
    );
})
