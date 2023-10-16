import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { RegisterFormValidators, LoginFormValidators } from './FormValidators';
import Spinner from './Spinner';
import { setUserCredentials } from '../actions/userActions';
import { API_DIRECTORY } from '../utils/constants';
import {
	resetValidators,
	updateValidators,
	isFormValid,
} from '../utils/commons';
import '../styles/CredentialModal.scss';

class RegisterMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				username: '',
				email: '',
				password: '',
				password_repeat: '',
				termsandconditions: false,
			},
			uploading: false,
		};
		this.validators = RegisterFormValidators;
		resetValidators(this.validators);
	}

	handleInputChange = (e, inputPropName, compareValue) => {
		const newState = { ...this.state };
		newState.user[inputPropName] =
			e.target.type === 'checkbox' ? e.target.checked : e.target.value;
		this.setState(newState);
		if (e.target.type === 'checkbox') {
			this.validators = updateValidators(
				this.validators,
				inputPropName,
				e.target.checked
			);
		} else {
			this.validators = updateValidators(
				this.validators,
				inputPropName,
				e.target.value,
				compareValue
			);
		}
		if (!this.validators[inputPropName].valid) {
			e.target.setCustomValidity(this.validators[inputPropName].errors[0]);
		} else {
			e.target.setCustomValidity('');
		}
	};

	handleFormSubmit = (e) => {
		e.preventDefault();
		this.setState({ uploading: true });
		if (isFormValid(this.validators)) {
			fetch(API_DIRECTORY + '/signUp', {
				method: 'post',
				headers: {
					'content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify({
					user_name: this.state.user.username,
					user_email: this.state.user.email.toLowerCase().trim(),
					user_password: this.state.user.password,
				}),
				credentials: 'include',
			})
				.then((res) => {
					if (res.status === 200) return res.json();
					else return { error: 'there was an error with response' };
				})
				.then((responseSignUp) => {
					if (responseSignUp.status === 'success') {
						this.props.closeModal();
						this.props.openDialog(
							responseSignUp.status,
							responseSignUp.message
						);
					} else {
						this.props.openDialog('error', responseSignUp.message);
					}
					this.setState({ uploading: false });
				})
				.catch((err) => {
					this.props.openDialog(
						'error',
						'Bilinmeyen bir hatayla karşılaşıldı.'
					);
					throw new Error(err);
				});
		}
	};

	handleChangeUsername = (e) => {
		this.handleInputChange(e, 'username');
	};

	handleChangeEmail = (e) => {
		this.handleInputChange(e, 'email');
	};

	handleChangePassword = (e) => {
		this.handleInputChange(e, 'password');
	};

	handleChangePasswordRepeat = (e) => {
		const { user } = this.state;
		this.handleInputChange(e, 'password_repeat', user.password);
	};

	handleChangeTermsAndConditions = (e) => {
		this.handleInputChange(e, 'termsandconditions');
	};

	render() {
		const { uploading, user } = this.state;
		const spinner = uploading ? (
			<div className='credentials-modal-spinner'>
				<Spinner />
			</div>
		) : null;

		return (
			<form
				id='register-form'
				className='credentials-register-form'
				onSubmit={this.handleFormSubmit}
			>
				{spinner}
				<div className='credentials-modal-input'>
					<input
						type='text'
						id='register-username'
						className='register-username'
						name='username'
						placeholder='Kullanıcı adı'
						value={user.username}
						onInvalid={this.handleChangeUsername}
						onChange={this.handleChangeUsername}
						required
					/>
					<label htmlFor='username'>Kullanıcı adı</label>
				</div>
				<div className='credentials-modal-input'>
					<input
						type='email'
						id='register-email'
						className='register-email'
						name='email'
						placeholder='E-posta adresi'
						value={user.email}
						onInvalid={this.handleChangeEmail}
						onChange={this.handleChangeEmail}
						required
					/>
					<label htmlFor='email'>E-posta adresi</label>
				</div>
				<div className='credentials-modal-input'>
					<input
						type='password'
						id='register-password'
						className='register-password'
						name='password'
						value={user.password}
						placeholder='Şifre'
						onInvalid={this.handleChangePassword}
						onChange={this.handleChangePassword}
						required
					/>
					<label htmlFor='password'>Şifre</label>
				</div>
				<div className='credentials-modal-input'>
					<input
						type='password'
						id='register-passwordrepeat'
						className='register-passwordrepeat'
						name='password_repeat'
						value={user.password_repeat}
						placeholder='Şifre (Tekrar)'
						onInvalid={this.handleChangePasswordRepeat}
						onChange={this.handleChangePasswordRepeat}
						required
					/>
					<label htmlFor='password_repeat'>Şifre (Tekrar)</label>
				</div>
				<div className='credentials-modal-input'>
					<div id='register-accept-container'>
						<input
							type='checkbox'
							id='register-acceptterms'
							className='register-acceptterms'
							name='termsandconditions'
							value={user.termsandconditions}
							onInvalid={this.handleChangeTermsAndConditions}
							onChange={this.handleChangeTermsAndConditions}
							required
						/>
						<div className='checkbox-label'>
							<Link
								to={{ pathname: '/info', hash: 'contract' }}
								target='_blank'
							>
								Kullanıcı Sözleşmesi
							</Link>
							ni ve{' '}
							<Link to={{ pathname: '/info', hash: 'privacy' }} target='_blank'>
								Gizlilik Politikası
							</Link>
							nı kabul ediyorum.
						</div>
					</div>
				</div>
				{/* <div className='credentials-modal-input'>
					<div
						id='register-recaptcha'
						className='g-recaptcha credentials-modal-recaptcha'
					/>
				</div> */}
				<div className='credentials-modal-input'>
					<input
						type='submit'
						className='credentials-modal-button'
						value='Kayıt Ol'
					/>
				</div>
			</form>
		);
	}
}

class LoginMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {
				nameoremail: '',
				password: '',
			},
			uploading: false,
		};
		this.validators = LoginFormValidators;
		resetValidators(this.validators);
	}

	handleInputChange = (e, inputPropName) => {
		const newState = { ...this.state };
		newState.user[inputPropName] = e.target.value;
		this.setState(newState);
		this.validators = updateValidators(
			this.validators,
			inputPropName,
			e.target.value
		);
		if (!this.validators[inputPropName].valid) {
			e.target.setCustomValidity(this.validators[inputPropName].errors[0]);
		} else {
			e.target.setCustomValidity('');
		}
	};

	handleFormSubmit = (e) => {
		e.preventDefault();
		const { user } = this.state;
		this.setState({ uploading: true });
		if (isFormValid(this.validators)) {
			fetch(API_DIRECTORY + '/logIn', {
				method: 'post',
				headers: {
					'content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify({
					user_nameoremail: user.nameoremail,
					user_password: user.password,
				}),
				credentials: 'include',
			})
				.then((res) => {
					if (res.status === 200) {
						return res.json();
					} else {
						return { error: 'there was an error with response' };
					}
				})
				.then((responseLogin) => {
					if (responseLogin.status === 'success') {
						var returnUser = {
							id: responseLogin.user.user_id,
							username: responseLogin.user.user_name,
						};
						this.props.setUserCredentials(returnUser);
						this.setState({
							user: {
								nameoremail: '',
								password: '',
							},
						});
						this.props.closeModal();
					} else {
						this.props.openDialog('error', responseLogin.message);
					}
					this.setState({ uploading: false });
				})
				.catch((err) => {
					this.props.openDialog(
						'error',
						'Bilinmeyen bir hatayla karşılaşıldı.'
					);
					throw new Error(err);
				});
		}
	};

	handleResetPassword = () => {
		this.props.closeModal();
		this.props.history.push({ pathname: '/resetpassword' });
	};

	handleChangeNameOrEmail = (e) => {
		this.handleInputChange(e, 'nameoremail');
	};
	handleChangePassword = (e) => {
		this.handleInputChange(e, 'password');
	};

	render() {
		const { uploading, user } = this.state;
		const spinner = uploading ? (
			<div className='credentials-modal-spinner'>
				<Spinner />
			</div>
		) : null;

		return (
			<div>
				<form
					id='login-form'
					className='credentials-login-form'
					onSubmit={this.handleFormSubmit}
				>
					{spinner}
					<div className='credentials-modal-input'>
						<input
							type='text'
							id='login-username'
							className='login-username'
							name='nameoremail'
							placeholder='Kullanıcı adı ya da e-posta adresiniz'
							value={user.nameoremail}
							onInvalid={this.handleChangeNameOrEmail}
							onChange={this.handleChangeNameOrEmail}
							required
						/>
						<label htmlFor='nameoremail'>Kullanıcı adı ya da e-posta</label>
					</div>
					<div className='credentials-modal-input'>
						<input
							type='password'
							id='login-password'
							className='login-password'
							name='password'
							placeholder='Şifreniz'
							value={user.password}
							onInvalid={this.handleChangePassword}
							onChange={this.handleChangePassword}
							required
						/>
						<label htmlFor='password'>Şifreniz</label>
					</div>
					<div className='credentials-modal-input'>
						<input
							type='submit'
							className='credentials-modal-button'
							value='Giriş Yap'
						/>
					</div>
					<div className='credentials-modal-input'>
						<div
							className='login-forgotpassword-container'
							onClick={this.handleResetPassword}
						>
							Şifremi unuttum
						</div>
					</div>
				</form>
			</div>
		);
	}
}
const RoutedConnectedLoginMenu = withRouter(
	connect(null, { setUserCredentials })(LoginMenu)
);

class CredentialModal extends Component {
	constructor(props) {
		super(props);
		this.modalCredentialRef = React.createRef();
		this.handleClickOutsideOfCredentialModal =
			this.handleClickOutsideOfCredentialModal.bind(this);
	}

	componentDidMount() {
		window.addEventListener(
			'click',
			this.handleClickOutsideOfCredentialModal,
			true
		);
		window.addEventListener(
			'touchstart',
			this.handleClickOutsideOfCredentialModal,
			true
		);
	}
	componentWillUnmount() {
		window.removeEventListener(
			'click',
			this.handleClickOutsideOfCredentialModal,
			true
		);
		window.removeEventListener(
			'touchstart',
			this.handleClickOutsideOfCredentialModal,
			true
		);
	}

	handleClickOutsideOfCredentialModal = (e) => {
		if (
			this.modalCredentialRef &&
			!this.modalCredentialRef.current.contains(e.target)
		) {
			this.props.closeModal();
		}
	};

	render() {
		let credentialsModalRegisterMenuTitleClasses = classNames(
			'credentials-modal-menutitle',
			{
				'credentials-modal-menutitle-active': this.props.isRegisterMenuActive,
			}
		);
		let credentialsModalLoginMenuTitleClasses = classNames(
			'credentials-modal-menutitle',
			{
				'credentials-modal-menutitle-active': this.props.isLoginMenuActive,
			}
		);
		const credentialsNavArea = (
			<>
				<span
					className='credentials-modal-close'
					onClick={this.props.closeModal}
				></span>
				<div>
					<ul className='credentials-modal-nav'>
						<li
							className={credentialsModalRegisterMenuTitleClasses}
							id='credentials-modal-menutitle-register'
							onClick={this.props.toggleModalMenu}
						>
							KAYIT
						</li>
						<li
							className={credentialsModalLoginMenuTitleClasses}
							id='credentials-modal-menutitle-login'
							onClick={this.props.toggleModalMenu}
						>
							GİRİŞ
						</li>
					</ul>
				</div>
			</>
		);

		let credentialsRegisterArea = null;
		if (this.props.isRegisterMenuActive) {
			credentialsRegisterArea = (
				<div className='credentials-register-container'>
					<RegisterMenu
						closeModal={this.props.closeModal}
						openDialog={this.props.openDialog}
					/>
				</div>
			);
		}

		let credentialsLoginArea = null;
		if (this.props.isLoginMenuActive) {
			credentialsLoginArea = (
				<div className='credentials-login-container'>
					<RoutedConnectedLoginMenu
						closeModal={this.props.closeModal}
						openDialog={this.props.openDialog}
					/>
				</div>
			);
		}
		return (
			<div className='credentials-modal-container'>
				<div className='credentials-modal' ref={this.modalCredentialRef}>
					{credentialsNavArea}
					{credentialsRegisterArea}
					{credentialsLoginArea}
				</div>
			</div>
		);
	}
}

export default CredentialModal;
