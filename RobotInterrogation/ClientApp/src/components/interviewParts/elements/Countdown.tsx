import * as React from 'react';
import { useEffect, useState } from 'react';
import './Countdown.css';
import { Typography } from '@material-ui/core';

interface IProps {
    duration: number,
    onElapsed?: () => void;
}

export const Countdown: React.FunctionComponent<IProps> = props => {
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

    if (timeRemaining > 0) {
        const minutes = Math.floor(timeRemaining / 60);
        let seconds = (timeRemaining - minutes * 60).toString();
        if (seconds.length < 2) {
            seconds = `0${seconds}`;
        }

        return (
            <Typography className="countdown">
                {minutes}:{seconds} remaining
            </Typography>
        );
    }

    return (
        <Typography className="countdown countdown--expired">
            time expired
        </Typography>
    );
}