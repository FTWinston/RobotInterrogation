import React from 'react';
import { Typography } from '@material-ui/core';

export const P: React.FunctionComponent = props => {
    return (
        <Typography paragraph>
            {props.children}
        </Typography>
    )
}