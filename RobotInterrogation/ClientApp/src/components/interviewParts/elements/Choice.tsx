import * as React from 'react';
import { makeStyles, ButtonGroup } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
}));

export const Choice: React.FunctionComponent = props => {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <ButtonGroup orientation="vertical">
                {props.children}
            </ButtonGroup>
        </div>
    )
}