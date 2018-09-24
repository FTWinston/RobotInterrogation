// import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import * as RoutesModule from './Routes';

const routes = RoutesModule.routes;

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
ReactDOM.render(
    <BrowserRouter children={routes} basename={baseUrl} />,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
