import 'bootstrap/dist/css/bootstrap-reboot.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
import { Home } from './components/Home';
import { Host } from './components/Host';
import { Interview } from './components/Interview';
import './index.css';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
ReactDOM.render(
    (<BrowserRouter basename={baseUrl}>
        <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/host" component={Host} />
            <Route path="/about" component={About} />
            <Route path="/interview/:id" component={Interview} />
        </Switch>
    </BrowserRouter>),
    document.getElementById('root')
);
