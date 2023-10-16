import React, { Component } from 'react';

import Home from './Home.js';
import '../styles/App.scss';

class NotFound extends Component {
	constructor(props) {
		super(props);
		this.openDialog();
	}

	openDialog = () => {
		this.props.openDialog('error', 'Üzgünüz! Aradığını sayfa bulunamadı.');
	};

	render() {
		return (
			<div>
				<Home />
			</div>
		);
	}
}

export default NotFound;
