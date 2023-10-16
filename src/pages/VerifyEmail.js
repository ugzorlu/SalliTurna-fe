import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import '../styles/App.scss';

import { API_DIRECTORY } from '../utils/constants.js';

class VerifyEmail extends Component {
	constructor(props) {
		super(props);
		this.verifyEmail();
	}

	verifyEmail() {
		fetch(API_DIRECTORY + '/verifyEmail/' + this.props.match.params.token, {
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseVerifyEmail) => {
				if (responseVerifyEmail.status === 'success') {
					this.props.openDialog(
						responseVerifyEmail.status,
						responseVerifyEmail.message
					);
				} else {
					this.props.openDialog(
						responseVerifyEmail.status,
						responseVerifyEmail.message
					);
				}
				setTimeout(() => {
					this.props.history.push('/');
				}, 2500);
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	render() {
		return <div></div>;
	}
}

export default withRouter(VerifyEmail);
