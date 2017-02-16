import React from 'react';
import ReactDOM from 'react-dom';
import Build from './components/Build';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers';
import {recievedStats} from './actions';

const store = createStore(reducers);

ReactDOM.render(
    <Provider store={store}>
        <Build />
    </Provider>,
    document.getElementById('root')
);


window.addStats = stats => {
    store.dispatch(recievedStats(stats));
};

