import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from './components/Home';
import { Host } from './components/Host';
import { Interview } from './components/Interview';
import { Join } from './components/Join';
import { Rules } from './components/Rules';

export const routes = (
    <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/host" component={Host} />
        <Route path="/join/:reason?" component={Join} />
        <Route path="/rules" component={Rules} />
        <Route path="/interview/:id" component={Interview} />
    </Switch>
);