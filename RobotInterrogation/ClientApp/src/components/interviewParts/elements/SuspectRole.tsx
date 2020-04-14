import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { makeStyles, Card, Typography, CardContent } from '@material-ui/core';

export interface ISuspectRole {
    type: string;
    fault: string;
    traits: string,
}

interface IProps {
    role: ISuspectRole;
}

const useStyles = makeStyles(theme => ({
    root: {
        margin: '1em 0',
    },
    rootHuman: {

    },
    rootPatient: {
        backgroundColor: '#eee',
    },
    rootViolent: {
        backgroundColor: '#666',
        color: '#ccc',
    },
    title: {
        textAlign: 'center',
    },
    traits: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        marginTop: '1em',
        '& ul': {
            margin: 0,
        },
        '& p': {
            margin: 0,
        }
    }
}))

export const SuspectRole: React.FunctionComponent<IProps> = props => {
    const classes = useStyles();

    let displayName = props.role.type.replace('Robot', ' Robot');
    if (props.role.type !== "Human") {
        displayName += ` (${props.role.fault})`;
    }

    return (
        <Card className={getRootClasses(props, classes)} variant="outlined">
            <CardContent>
                <Typography className={classes.title} variant="h5">{displayName}</Typography>
                <Typography className={classes.traits} component={ReactMarkdown} source={props.role.traits} />
            </CardContent>
        </Card>
    )
}
function getRootClasses(props: React.PropsWithChildren<IProps>, classes: Record<"root" | "rootHuman" | "rootPatient" | "rootViolent" | "title" | "traits", string>) {
    let rootClasses: string;
    switch (props.role.type) {
        case 'Human':
            rootClasses = `${classes.root} ${classes.rootHuman}`;
            break;
        case 'PatientRobot':
            rootClasses = `${classes.root} ${classes.rootPatient}`;
            break;
        case 'ViolentRobot':
            rootClasses = `${classes.root} ${classes.rootViolent}`;
            break;
        default:
            rootClasses = classes.root;
            break;
    }
    return rootClasses;
}

