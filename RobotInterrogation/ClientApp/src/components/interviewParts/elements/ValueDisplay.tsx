import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        textAlign: 'center',
        fontSize: '1.25em',
    },
}));

interface IProps {
    value: string;
}

export const ValueDisplay: React.FunctionComponent<IProps> = props => {
    const classes = useStyles();

    return (
        <Typography paragraph>
            {props.children}
            <div className={classes.root}>
                {props.value}
            </div>
        </Typography>
    )
}