import React from 'react';
import { Container } from '@material-ui/core';

export const Page: React.FunctionComponent = props => {
    return (
        <Container maxWidth="sm">
            {props.children}
        </Container>
    )
}