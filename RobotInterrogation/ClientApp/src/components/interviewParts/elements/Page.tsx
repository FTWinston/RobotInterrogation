import React from 'react';
import { Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    main: {
        position: 'relative',
    },
}));

export const Page: React.FunctionComponent = props => {
    const classes = useStyles();

    return (
        <Container maxWidth="sm" className={classes.main}>
            {props.children}
        </Container>
    )
}