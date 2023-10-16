import React, { Component } from 'react';

import '../styles/App.scss';
import '../styles/Contact.scss';
import { SendFeedbackValidators } from '../components/FormValidators';
import { API_DIRECTORY } from '../utils/constants';
import {
	resetValidators,
	updateValidators,
	isFormValid,
} from '../utils/commons';

class Contact extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isSendFeedbackHidden: false,
			email: '',
			title: '',
			feedback: '',
		};
		this.validators = SendFeedbackValidators;
		resetValidators(this.validators);
		if (this.props.location.search) {
			const title = `${this.props.location.search.replace(
				'?postid=',
				''
			)} numaralı gönderi hakkında şikayetim var`;
			this.state = {
				title,
			};
			updateValidators(this.validators, 'title', title);
		}
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	componentDidUpdate() {
		window.scrollTo(0, 0);
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

	handleSendFeedback = async (e) => {
		e.preventDefault();
		const { email, title, feedback } = this.state;
		if (isFormValid(this.validators)) {
			try {
				const res = await fetch(`${API_DIRECTORY}/sendFeedback`, {
					method: 'post',
					headers: {
						'content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({
						sender_email: email.toLowerCase().trim(),
						feedback_title: title,
						feedback_text: feedback,
					}),
					credentials: 'include',
				});
				const responseSendFeedback = await res.json();
				if (responseSendFeedback.status === 'success') {
				}
				this.props.openDialog(
					responseSendFeedback.status,
					responseSendFeedback.message
				);
				this.props.history.push('/');
			} catch {
				this.props.openDialog('error', 'Bilinmeyen bir hata ile karşılaşıldı.');
			}
		}
	};

	handleChangeSenderEmail = (e) => {
		this.handleInputChange(e, 'email');
	};

	handleChangeTitle = (e) => {
		this.handleInputChange(e, 'title');
	};

	handleChangeFeedback = (e) => {
		this.handleInputChange(e, 'feedback');
	};

	render() {
		const { isSendFeedbackHidden, title } = this.state;
		return (
			<div className='sendfeedback-container'>
				<form
					className='sendfeedback-form'
					id='sendfeedback-form'
					onSubmit={this.handleSendFeedback}
					style={{ display: isSendFeedbackHidden ? 'none' : 'block' }}
				>
					<div className='sendfeedback-text'>
						Bize aşağıdaki formu doldurarak ulaşabilirsiniz.
					</div>
					<div className='sendfeedback-email-wrapper'>
						<input
							className='sendfeedback-email'
							type='email'
							name='email'
							placeholder='E-posta adresi'
							onChange={this.handleChangeSenderEmail}
							onInvalid={this.handleChangeSenderEmail}
							required
						/>
						<label htmlFor='email'>E-mail adresi</label>
					</div>
					<div className='sendfeedback-title-wrapper'>
						<input
							className='sendfeedback-title'
							type='text'
							name='title'
							value={title}
							placeholder='Konu'
							onChange={this.handleChangeTitle}
							onInvalid={this.handleChangeTitle}
							required
						/>
						<label htmlFor='title'>Konu</label>
					</div>
					<div className='sendfeedback-feedback-wrapper'>
						<textarea
							className='sendfeedback-feedback'
							rows='10'
							name='feedback'
							placeholder='Mesajınız'
							onChange={this.handleChangeFeedback}
							onInvalid={this.handleChangeFeedback}
							required
						/>
						<label htmlFor='feedback'>Mesajınız</label>
					</div>
					<div className='sendfeedback-sendbutton-wrapper'>
						<input
							className='sendfeedback-sendbutton'
							type='submit'
							value='Gönder'
						/>
					</div>
				</form>
			</div>
		);
	}
}

export default Contact;
