import * as React from 'react';
import { setInterval } from 'timers';

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
        if (this.state.timeRemaining > 0) {
            return <div className="countdown">
                {this.state.timeRemaining}
            </div>
        }

        return <div className="countdown countdown--expired">
            time expired
        </div>
    }
}