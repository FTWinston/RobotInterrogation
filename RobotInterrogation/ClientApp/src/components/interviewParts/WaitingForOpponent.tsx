import * as React from 'react';
import './GameLink.css';
import { Container, Typography, Link } from '@material-ui/core';

interface IProps {
    interviewID: string;
}

export const WaitingForOpponent: React.FunctionComponent<IProps> = props => {
    const fullLocation = document.location.toString();
    const strippedProtocol = fullLocation.substr(fullLocation.indexOf('//') + 2);

    const fixedLocation = addWordBreaks(
        strippedProtocol.substr(0, strippedProtocol.indexOf(props.interviewID)),
        char => char === '/' || char === '.'
    );
    const detailLocation = addWordBreaks(
        props.interviewID,
        char => char === char.toUpperCase()
    );

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Waiting for opponent to&nbsp;join</Typography>

            <Typography paragraph>Invite a friend by giving them this link:</Typography>

            <Typography paragraph>
                <Link target="_new" className="gameLink" href={fullLocation}>{fixedLocation}<wbr/><span className="gameLink__focus">{detailLocation}</span></Link>
            </Typography>

            <Typography paragraph>
                <strong>Don't</strong> open the link yourself, or you will become your own opponent.
            </Typography>
        </Container>
    );
}

function addWordBreaks(text: string, shouldBreak: (char: string) => boolean) {
    const results: JSX.Element[] = [];

    let word = '';
    let i = 0;

    for (const char of text) {
        if (shouldBreak(char) && word.length > 0) {
            if (results.length > 0) {
                results.push(
                    <React.Fragment key={i++}>
                        <wbr/>
                        {word}
                    </React.Fragment>
                )
            }
            else {
                results.push(
                    <React.Fragment key={i++}>
                        {word}
                    </React.Fragment>
                )
            }
            
            word = '';
        }

        word = word + char;
    }
    
    if (word.length > 0) {
        results.push(
            <React.Fragment key={i++}>
                <wbr/>
                {word}
            </React.Fragment>
        );
    }

    return results;
}