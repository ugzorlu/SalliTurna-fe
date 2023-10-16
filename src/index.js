import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import App from './App';
import reducer from './reducers';

const store = createStore(reducer);

// Using depreceted ReactDOM.render() because of compatibility issues with react-router-dom
document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>,
		document.getElementById('root')
	);
});
