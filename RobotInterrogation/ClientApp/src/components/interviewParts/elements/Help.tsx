import React from 'react';
import { Typography, Popover, makeStyles, Link } from '@material-ui/core';
import { P } from './P';

type Entry = 'positions'
| 'roles'
| 'penalty'
| 'packet'
| 'inducer'
| 'background'
| 'questions';

interface Props {
    entry: Entry;
}

const useStyles = makeStyles(theme => ({
    button: {
        textDecorationLine: 'underline',
        textDecorationStyle: 'double',
        textDecorationColor: 'green',
        cursor: 'help',
        '&:hover': {
            color: 'green',
        },
    },
    popup: {
        padding: theme.spacing(2),
    },
}));

export const Help: React.FC<Props> = props => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement>();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(undefined);
    };
  
    const open = Boolean(anchorEl);

    const id = open ? 'help' : undefined;

    return <>
        <Link
            onClick={handleClick}
            className={classes.button}
            aria-describedby={id}
            color="inherit"
            underline="none"
        >
            {props.children}
        </Link>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
        >
            {getContent(props.entry, classes.popup)}
        </Popover>
    </>
}

function getContent(entry: Entry, className: string): JSX.Element {
    switch (entry) {
        case 'positions':
            return <div className={className}>
                <Typography paragraph>The Interviewer must try to determine whether the Suspect is a human or a robot.</Typography>
                
                <Typography>The Suspect should try to convince the Interviewer that they are human, regardless of their true nature.</Typography>
            </div>

        case 'roles':
            return <Typography className={className}>
                Human ... Patient ... Violent
            </Typography>

        case 'penalty':
            return <div className={className}>
                <Typography paragraph>The penalty is a suspicious action that robots may perform under stress during the interview.</Typography>
                
                <Typography>Human suspects should avoid performing the penalty.</Typography>
            </div>

        case 'packet':
            return <Typography paragraph className={className}>PACKET HELP.</Typography>

        case 'inducer':
            return <div className={className}>
                <P>Humans will need to solve a puzzle to answer the question.</P>
                <P>Robots will see the same diagram as the Interviewer, but need time to read the details of their role.</P>
            </div>

        case 'background':
            return <Typography paragraph className={className}>BACKGROUND HELP.</Typography>

        case 'questions':
            return <Typography paragraph className={className}>QUESTION HELP.</Typography>
    }
}