import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: '2em',
    },
}));

export const ActionSet: React.FunctionComponent<{}> = props => {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            {props.children}
        </div>
    )
}