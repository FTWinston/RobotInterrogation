import * as React from 'react';
import { useEffect, useState } from 'react';
import './Countdown.css';

interface IProps {
    duration: number,
    onElapsed?: () => void;
}

export const Countdown: React.FunctionComponent<IProps> = props => {
    const [timeRemaining, setTimeRemaining] = useState(props.duration);

    useEffect(
        () => {
            let interval: NodeJS.Timeout | undefined = setInterval(() => {
                setTimeRemaining(val => {
                    if (interval !== undefined && val <= 1) {
                        clearInterval(interval);
                        interval = undefined;

                        if (props.onElapsed) {
                            props.onElapsed();
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
        []
    );

    if (timeRemaining > 0) {
        const minutes = Math.floor(timeRemaining / 60);
        let seconds = (timeRemaining - minutes * 60).toString();
        if (seconds.length < 2) {
            seconds = `0${seconds}`;
        }

        return (
            <div className="countdown">
                {minutes}:{seconds} remaining
            </div>
        );
    }

    return (
        <div className="countdown countdown--expired">
            time expired
        </div>
    );
}