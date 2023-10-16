import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import '../styles/App.scss';
import '../styles/Cookie.scss';

const mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};

class Cookie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isCookieHidden: true,
		};
	}

	componentDidMount() {
		this.setVisibilityAccordingToUser();
	}

	componentDidUpdate(prevProps) {
		if (this.props.user !== prevProps.user) {
			this.setVisibilityAccordingToUser();
		}
	}

	setVisibilityAccordingToUser = () => {
		const userid = this.props.user.id;
		if (userid) {
			this.setState({ isCookieHidden: true });
		} else {
			this.setState({ isCookieHidden: false });
		}
	};

	handleCloseCookie = () => {
		this.setState({ isCookieHidden: true });
	};

	render() {
		return (
			<div
				className='cookie-container'
				style={{ display: this.state.isCookieHidden ? 'none' : 'block' }}
			>
				<div className='cookie-text-wrapper'>
					<div className='cookie-text'>
						Size daha iyi hizmet sunabilmek için çerez kullanıyoruz. Şallı
						Turna'yı kullanarak çerezlere izin vermektesiniz. Daha fazla bilgi
						için&nbsp;
						<Link to={{ pathname: '/info', hash: 'privacy' }}>tıklayın.</Link>
					</div>
				</div>
				<div className='cookie-closebutton-wrapper'>
					<div
						className='cookie-closebutton'
						onClick={this.handleCloseCookie}
					></div>
				</div>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps)(Cookie));
