import * as React from 'react';
import { useEffect, useState } from 'react';
import './Countdown.css';
import { Fab, makeStyles } from '@material-ui/core';
import HourglassEmpty from '@material-ui/icons/HourglassEmpty';
import HourglassFull from '@material-ui/icons/HourglassFull';

interface IProps {
    duration: number,
    onElapsed?: () => void;
}

const useStyles = makeStyles(theme => ({
    wrapper: {
        position: 'absolute',
        left: 'calc(100% - 7em)',
        top: '0.5em',
    },
    main: {    
        position: 'fixed',
        paddingRight: '1em',
        pointerEvents: 'none',
    },
    expired: {
        animation: 'blinker 1s step-start infinite',
    },
    icon: {
        paddingRight: '0.15em',
    },
}))

export const Countdown: React.FunctionComponent<IProps> = props => {
    const classes = useStyles();

    const [timeRemaining, setTimeRemaining] = useState(props.duration);

    const onElapsed = props.onElapsed;

    useEffect(
        () => {
            let interval: NodeJS.Timeout | undefined = setInterval(() => {
                setTimeRemaining(val => {
                    if (interval !== undefined && val <= 1) {
                        clearInterval(interval);
                        interval = undefined;

                        if (onElapsed) {
                            onElapsed();
                        }
                        return 0;
                    }
                    return val - 1;
                });
            }, 1000);

            return () => {
                if (interval !== undefined) {
                    clearInterval(interval);
                }
            }
        },
        [onElapsed]
    );

    const elapsed = timeRemaining <= 0;

    const minutes = Math.floor(timeRemaining / 60);
    let seconds = (timeRemaining - minutes * 60).toString();
    if (seconds.length < 2) {
        seconds = `0${seconds}`;
    }

    const color = elapsed ? 'secondary' : 'primary';

    const mainClasses = elapsed
        ? `${classes.main} ${classes.expired}`
        : classes.main;

    const icon = elapsed
        ? <HourglassEmpty />
        : <HourglassFull />

    return (
        <div className={classes.wrapper}>
            <Fab size="small" color={color} className={mainClasses} variant="extended">
                {icon}
                {minutes}:{seconds}
            </Fab>
        </div>
    );
}