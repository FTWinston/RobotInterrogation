import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Home } from './components/Home';
import { Host } from './components/Host';
import { Interview } from './components/Interview';

export const routes = (
    <Switch>
        <Route path="/" exact={true} component={Home} />
        <Route path="/host" component={Host} />
        <Route path="/about" component={About} />
        <Route path="/interview/:id" component={Interview} />
    </Switch>
);