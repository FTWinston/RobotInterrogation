import * as React from 'react';
import { setInterval } from 'timers';
import './Countdown.css';

interface IProps {
    duration: number,
}

interface IState {
    timeRemaining: number,
}

export class Countdown extends React.PureComponent<IProps, IState> {
    private interval: NodeJS.Timer;

    constructor(props: IProps) {
        super(props);

        this.state = {
            timeRemaining: props.duration,
        };
    }

    public componentWillMount() {
        this.interval = setInterval(() => {
            this.setState(state => {
                if (state.timeRemaining <= 1) {
                    clearInterval(this.interval);
                }

                return {
                    timeRemaining: state.timeRemaining - 1,
                }
            })
        }, 1000);
    }

    public render() {
        const minutes = Math.floor(this.state.timeRemaining / 60);
        let seconds = (this.state.timeRemaining - minutes * 60).toString();
        if (seconds.length < 2) {
            seconds = '0' + seconds;
        }

        if (this.state.timeRemaining > 0) {
            return <div className="countdown">
                {minutes}:{seconds} remaining
            </div>
        }

        return <div className="countdown countdown--expired">
            time expired
        </div>
    }
}