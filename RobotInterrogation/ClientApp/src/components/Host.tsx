import * as React from 'react';
import { Redirect } from 'react-router';
import { query } from '../Connectivity';

interface IState {
    interviewID?: string;
}

export class Host extends React.PureComponent<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {};
    }

    public componentWillMount() {
        this.query();
    }

    public render() {
        if (this.state.interviewID !== undefined) {
            return <Redirect to={`/interview/${this.state.interviewID}`} />
        }

        return <div>
            Please wait...
        </div>;
    }

    private async query() {
        const id = await query<string>('/api/Data/GetNextSessionID')

        this.setState({
            interviewID: id,
        });
    }
}
