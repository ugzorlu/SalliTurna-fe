import React, { Component } from 'react';

import '../styles/App.scss';
import '../styles/ResetPassword.scss';
import {
	SendPasswordTokenValidators,
	NewPasswordFormValidators,
} from '../components/FormValidators';
import {
	resetValidators,
	updateValidators,
	isFormValid,
} from '../utils/commons';
import { API_DIRECTORY } from '../utils/constants';

class ResetPassword extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSendPasswordTokenHidden: false,
			isResetPasswordHidden: false,
		};
		if (this.props.location.search) {
			this.state = {
				isSendPasswordTokenHidden: true,
				// isResetPasswordHidden: false,
				token: this.props.location.search.replace('?token=', ''),
				newpassword: '',
			};
			this.validators = NewPasswordFormValidators;
		} else {
			this.state = {
				// isSendPasswordTokenHidden: false,
				isResetPasswordHidden: true,
				email: '',
			};
			this.validators = SendPasswordTokenValidators;
		}
		resetValidators(this.validators);
	}

	handleInputChange = (e, inputPropName) => {
		const newState = { ...this.state };
		newState[inputPropName] = e.target.value;
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

	handleSendPasswordToken = async (e) => {
		e.preventDefault();
		if (isFormValid(this.validators)) {
			try {
				const res = await fetch(API_DIRECTORY + '/sendPasswordToken', {
					method: 'post',
					headers: {
						'content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({
						user_email: this.state.email.toLowerCase().trim(),
					}),
					credentials: 'include',
				});
				const responseSendPasswordToken = await res.json();
				this.props.openDialog(
					responseSendPasswordToken.status,
					responseSendPasswordToken.message
				);
			} catch {
				this.props.openDialog('error', 'Bilinmeyen bir hata ile karşılaşıldı.');
			}
		}
	};

	handleChangeEmail = (e) => {
		this.handleInputChange(e, 'email');
	};

	handleResetPassword = async (e) => {
		e.preventDefault();
		if (isFormValid(this.validators)) {
			try {
				const res = await fetch(API_DIRECTORY + '/resetPassword', {
					method: 'post',
					headers: {
						'content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({
						resetpassword_token: this.state.token,
						user_newpassword: this.state.newpassword,
					}),
					credentials: 'include',
				});
				const responseResetPassword = await res.json();
				this.props.history.push('/');
				this.props.openDialog(
					responseResetPassword.status,
					responseResetPassword.message
				);
			} catch {
				this.props.openDialog('error', 'Bilinmeyen bir hata ile karşılaşıldı.');
			}
		}
	};

	handleChangeNewPassword = (e) => {
		this.handleInputChange(e, 'newpassword');
	};

	render() {
		return (
			<div className='sendpasswordtoken-container'>
				<div className='sendpasswordtoken-wrapper'>
					<form
						className='sendpasswordtoken-form'
						id='sendpasswordtoken-form'
						onSubmit={this.handleSendPasswordToken}
						style={{
							display: this.state.isSendPasswordTokenHidden ? 'none' : 'block',
						}}
					>
						<div className='sendpasswordtoken-text'>
							Kayıt olduğunuz e-posta adresini girin. Adresinize şifre yenileme
							linki göndereceğiz.
						</div>
						<div className='sendpasswordtoken-email-wrapper'>
							<input
								className='sendpasswordtoken-email'
								type='email'
								name='email'
								placeholder='E-posta adresi'
								onChange={this.handleChangeEmail}
								onInvalid={this.handleChangeEmail}
								required
							/>
							<label htmlFor='email'>E-mail adresi</label>
						</div>
						<div className='sendpasswordtoken-bottom'>
							<div className='sendpasswordtoken-sendbutton-wrapper'>
								<input
									className='sendpasswordtoken-sendbutton'
									type='submit'
									value='Şifremi sıfırla'
								/>
							</div>
						</div>
					</form>

					<form
						className='resetpassword-form'
						id='resetpassword-form'
						onSubmit={this.handleResetPassword}
						style={{
							display: this.state.isResetPasswordHidden ? 'none' : 'block',
						}}
					>
						<div className='resetpassword-password-wrapper'>
							<input
								className='resetpassword-password'
								type='password'
								name='password'
								placeholder='Yeni şifre'
								onChange={this.handleChangeNewPassword}
								onInvalid={this.handleChangeNewPassword}
								required
							/>
							<label htmlFor='password'>Yeni şifre</label>
						</div>
						<div className='sendpasswordtoken-bottom'>
							<div className='resetpassword-sendbutton-wrapper'>
								<input
									className='resetpassword-sendbutton'
									type='submit'
									value='Şifremi sıfırla'
								/>
							</div>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default ResetPassword;
