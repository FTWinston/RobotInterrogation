import * as React from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';

interface IState {
    interviewID: string;
    join: boolean;
}

export class Join extends React.PureComponent<RouteComponentProps<{ reason?: string }>, IState > {
    constructor(props: RouteComponentProps<{ reason?: string }>) {
        super(props);

        this.state = {
            interviewID: '',
            join: false,
        };
    }

    public render() {
        if (this.state.join) {
            return <Redirect to={`/interview/${this.state.interviewID}`} />
        }

        let message: JSX.Element | undefined;
        switch (this.props.match.params.reason) {
            case 'invalid':
                message = <div className="alert alert-warning">The ID you entered doesn't match an open interview session.</div>; break;
        }

        const onSubmit = () => this.setState({ join: true });
        const onChange = (e: React.ChangeEvent<HTMLInputElement>) => this.setState({ interviewID: e.target.value });

        return <div>
            <p className="lead">
                Enter the identifier of the interview to join:
            </p>

            {message}

            <form onSubmit={onSubmit}>
                <div className="">
                    <input placeholder="Please specify" type="textbox" value={this.state.interviewID} onChange={onChange} />
                </div>

                <div className="">
                    <input className="" type="submit" value="Join" />
                </div>
            </form>

            <Link to="/">Go back</Link>
        </div>;
    }
}
