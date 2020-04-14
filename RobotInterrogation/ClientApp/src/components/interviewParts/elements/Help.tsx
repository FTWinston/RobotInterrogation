import React from 'react';
import { Typography, Popover, makeStyles, Link } from '@material-ui/core';

type Entry = 'positions'
| 'roles'
| 'penalty'
| 'packet'
| 'inducer'
| 'background'
| 'questions'
| 'timer';

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
            return <Typography className={className} component="div">
                <p>The Interviewer must try to determine whether the Suspect is a human or a robot.</p>
                
                <p>The Suspect should try to convince the Interviewer that they are human, regardless of their true nature.</p>
            </Typography>

        case 'roles':
            return <Typography className={className} component="div">
                <p>A human Suspect has nothing to hide, and no restrictions on their behaviour.</p>
                <p>A patient robot has a restriction, something they cannot mention.</p>
                <p>A violent robot has an obsession, and must complete tasks to fulfil this obsession and allow them to kill the Interviewer.</p>
            </Typography>

        case 'penalty':
            return <Typography className={className} component="div">
                <p>The penalty is a suspicious action that robots may perform under stress during the interview.</p>
                
                <p>Patient robots must perform the penalty once for each time they violate their restriction.</p>
                <p>Violent robots may perform the penalty twice as part of their de-programming.</p>
                <p>Human suspects should avoid performing the penalty, as this may make the Investigator think that they are a robot.</p>
            </Typography>

        case 'packet':
            return <Typography className={className} component="div">
                An interview packet is a collection of question prompts and robot roles that relate to them.
            </Typography>

        case 'inducer':
            return <Typography className={className} component="div">
                <p>The Interviewer asks the Suspect a question based on a simple diagram, and then administers the inducer. This reveals the Suspect's role to them.</p>
                <p>Robots will see the same diagram as the Interviewer, but need time to read the details of their role.</p>
                <p>Humans will need to solve more complicated diagram to answer the question.</p>
            </Typography>

        case 'background':
            return <Typography className={className} component="div">
                <p>Backgrounds provide the Suspect with a biographical detail to help them improvise a character.</p>
                <p>The Investigator and the Suspect should act as if the background really is true.</p>
            </Typography>

        case 'questions':
            return <Typography className={className} component="div">
                <p>The questions in an interview packet relate directly to the patient and violent robot roles in that packet.</p>
                <p>The Investigator can deviate as much as they like, but these questions should help draw out patterns of robot behavior.</p>
            </Typography>

        case 'timer':
            return <Typography className={className} component="div">
                <p>The Interviewer has 5 minutes to question the Suspect. Once the time has elapsed, they may ask one final question.</p>
                <p>The Interviewer can conclude that the Suspect is a robot at any time, but must wait until the time has elapsed before they can conclude that the Suspect is a human.</p>
            </Typography>
    }
}