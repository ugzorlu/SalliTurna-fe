import React, { Component } from 'react';
import { connect } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';
import { Image, Transformation } from 'cloudinary-react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import 'moment-timezone';
Moment.globalLocale = 'tr';
import classNames from 'classnames';

import { API_DIRECTORY } from '../utils/constants.js';
import { calendarStrings } from '../utils/constants.js';
import '../styles/App.scss';
import '../styles/Inbox.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

class Inbox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			LatestMessages: null,
			Messages: null,
			selectedCorrespender: null,
			messageText: '',
		};

		if (this.props.location.search) {
			const selectedCorrespenderId = `${this.props.location.search.replace(
				'?corresponderid=',
				''
			)}`;
			this.getProfile(selectedCorrespenderId);
		}
	}

	componentDidMount() {
		if (!this.props.location.search) {
			this.getLatestMessages();
			if (this.state.selectedCorrespender) {
				this.getMessages(this.state.selectedCorrespender.user_id);
			}
		}
		window.scrollTo(0, 0);
	}

	handleInputChange = (e, inputPropName) => {
		const newState = { ...this.state };
		newState[inputPropName] = e.target.value;
		this.setState(newState);
	};

	changeCorresponder = (e) => {
		const corresponderId = e.currentTarget.dataset.corresponderid;
		const corresponderName = e.currentTarget.dataset.correspondername;
		this.setState({
			selectedCorrespender: {
				user_id: corresponderId,
				user_name: corresponderName,
			},
		});
		this.getMessages(corresponderId);
	};

	getProfile = async (userid) => {
		const res = await fetch(API_DIRECTORY + '/getProfile/' + userid, {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				targetpagenumber: 1,
			}),
			credentials: 'include',
		});
		const responseProfile = await res.json();
		if (responseProfile.status === 'success') {
			this.setState({ selectedCorrespender: responseProfile.Profile.User });
		} else {
			this.props.openDialog(responseProfile.status, responseProfile.message);
		}
	};

	getLatestMessages = () => {
		fetch(API_DIRECTORY + '/getLatestMessages', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseLatestMessages) => {
				if (responseLatestMessages.status === 'success') {
					this.setState({
						LatestMessages: responseLatestMessages.LatestMessages,
					});
					if (responseLatestMessages.LatestMessages.length) {
						if (
							responseLatestMessages.LatestMessages[0].receiver.user_id ==
							this.props.User.id
						) {
							this.setState({
								selectedCorrespender:
									responseLatestMessages.LatestMessages[0].sender,
							});
							this.getMessages(
								responseLatestMessages.LatestMessages[0].sender.user_id
							);
						} else {
							this.setState({
								selectedCorrespender:
									responseLatestMessages.LatestMessages[0].receiver,
							});
							this.getMessages(
								responseLatestMessages.LatestMessages[0].receiver.user_id
							);
						}
					}
				} else {
					this.props.openDialog(
						responseLatestMessages.status,
						responseLatestMessages.message
					);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	getMessages = (corresponderid) => {
		fetch(API_DIRECTORY + '/getMessages/' + corresponderid, {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseMessages) => {
				if (responseMessages.status === 'success') {
					this.setState({ Messages: responseMessages.Messages });
				} else {
					this.props.openDialog(
						responseMessages.status,
						responseMessages.message
					);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	sendMessage = (e) => {
		e.preventDefault();
		let postform = document.getElementById('inbox-sendmessage-form');
		fetch(API_DIRECTORY + '/sendMessage', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				corresponder_id: this.state.selectedCorrespender.user_id,
				message_text: this.state.messageText,
			}),
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseSendMessage) => {
				if (responseSendMessage.status === 'success') {
					this.props.history.push('/inbox');
					this.setState({ messageText: '' });
					this.getLatestMessages();
				} else {
					this.props.openDialog(
						responseSendMessage.status,
						responseSendMessage.message
					);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	render() {
		const LatestMessages = this.state.LatestMessages;
		// if(LatestMessages == null){
		//   return null
		// }

		const usersArea = (
			<div className='inbox-users-container'>
				<div className='inbox-users-title'>
					{LatestMessages != null && LatestMessages.length
						? 'Kişiler'
						: 'Henüz mesajınız yok.'}
				</div>
				<div className='inbox-latestmessages-wrapper'>
					{LatestMessages != null &&
						LatestMessages.map((Message) => {
							const current_user = this.props.User.id;
							const sender = Message.sender.user_id;
							const receiver = Message.receiver.user_id;

							if (sender == current_user) {
								const publicPhoto = Message.receiver.user_photo ? (
									<Image
										cloudName='di6klblik'
										publicId={Message.receiver.user_photo}
										width='100%'
									>
										<Transformation
											radius='max'
											background='#FFF'
											width='40'
											height='40'
											crop='fill'
										/>
									</Image>
								) : null;
								return (
									<div
										key={'message-' + Message.message_id}
										className='inbox-latestmessages-messagepreview-wrapper'
										data-corresponderid={Message.receiver.user_id}
										data-correspondername={Message.receiver.user_name}
										onClick={this.changeCorresponder}
									>
										<div className='inbox-latestmessages-messagepreview-replyimage'>
											<FontAwesomeIcon icon={faReply} color='#2F2F3C' />
										</div>
										<div className='inbox-latestmessages-messagepreview-userphoto'>
											{publicPhoto}
										</div>
										<span className='inbox-latestmessages-messagepreview-username'>
											{Message.receiver.user_name}
										</span>
										<span className='inbox-latestmessages-messagepreview-messagedate'>
											{
												<Moment calendar={calendarStrings}>
													{Message.message_date}
												</Moment>
											}
										</span>
									</div>
								);
							} else {
								const publicPhoto = Message.sender.user_photo ? (
									<Image
										cloudName='di6klblik'
										publicId={Message.sender.user_photo}
										width='100%'
									>
										<Transformation
											radius='max'
											width='40'
											height='40'
											background='#FFF'
											crop='fill'
										/>
									</Image>
								) : null;

								let latestMessagesPreviewWrapper = classNames(
									'inbox-latestmessages-messagepreview-wrapper',
									{
										'inbox-latestmessages-messagepreview-wrapper-unread':
											Message.isUnread == 1,
									}
								);

								return (
									<div
										key={'message-' + Message.message_id}
										className={latestMessagesPreviewWrapper}
										data-corresponderid={Message.sender.user_id}
										data-correspondername={Message.sender.user_name}
										onClick={this.changeCorresponder}
									>
										<div className='inbox-latestmessages-messagepreview-userphoto'>
											{publicPhoto}
										</div>
										<span className='inbox-latestmessages-messagepreview-username'>
											{Message.sender.user_name}
										</span>
										<span className='inbox-latestmessages-messagepreview-messagedate'>
											{
												<Moment calendar={calendarStrings}>
													{Message.message_date}
												</Moment>
											}
										</span>
									</div>
								);
							}
						})}
				</div>
			</div>
		);

		let messagesArea = null;
		const Messages = this.state.Messages;
		if (Messages && Messages.length) {
			const current_user = this.props.User.id;
			const corresponder =
				Messages[0].sender.user_id == current_user
					? Messages[0].receiver
					: Messages[0].sender;
			const publicPhoto = corresponder.user_photo ? (
				<Image
					cloudName='di6klblik'
					publicId={corresponder.user_photo}
					width='100%'
				>
					<Transformation
						width='40'
						height='40'
						radius='max'
						background='#FFF'
						crop='fill'
					/>
				</Image>
			) : null;

			messagesArea = (
				<div className='inbox-messages-container'>
					<Link to={{ pathname: '/profile/' + corresponder.user_id }}>
						<div className='inbox-messages-userarea'>
							<span className='inbox-messages-userphoto'>{publicPhoto}</span>
							<span className='inbox-messages-username'>
								{corresponder.user_name}
							</span>
						</div>
					</Link>
					<div className='inbox-messages-wrapper'>
						{Messages.map((Message) => {
							const current_user = this.props.User.id;
							const sender = Message.sender.user_id;
							const receiver = Message.receiver.user_id;
							if (sender == current_user) {
								return (
									<div
										className='inbox-messages-message-right-container'
										key={'message-' + Message.message_id}
									>
										<div className='inbox-messages-message-right-wrapper'>
											<div className='inbox-messages-message-right'>
												{Message.message_text}
											</div>
											<div className='inbox-messages-messagetime-right'>
												<Moment calendar={calendarStrings}>
													{Message.message_date}
												</Moment>
											</div>
										</div>
									</div>
								);
							} else {
								return (
									<div
										className='inbox-messages-message-left-container'
										key={'message-' + Message.message_id}
									>
										<div className='inbox-messages-message-left-wrapper'>
											<div className='inbox-messages-message-left'>
												{Message.message_text}
											</div>
											<div className='inbox-messages-messagetime-left'>
												<Moment calendar={calendarStrings}>
													{Message.message_date}
												</Moment>
											</div>
										</div>
									</div>
								);
							}
						})}
					</div>
				</div>
			);
		}

		const SelectedCorrespender = this.state.selectedCorrespender;
		const sendmessageArea = ((LatestMessages != null &&
			LatestMessages.length) ||
			Messages != null ||
			SelectedCorrespender != null) && (
			<form
				className='inbox-sendmessage-form'
				id='inbox-sendmessage-form'
				onSubmit={this.sendMessage}
			>
				{this.state.selectedCorrespender && (
					<span className='inbox-sendmessage-corresponder'>
						Kime: {this.state.selectedCorrespender.user_name}
					</span>
				)}
				<div className='inbox-sendmessage-textarea-container'>
					<textarea
						id='inbox-sendmessage-textarea'
						className='inbox-sendmessage-textarea'
						name='message_text'
						value={this.state.messageText}
						placeholder={'Mesajınızı yazın.'}
						rows='6'
						onChange={(e) => this.handleInputChange(e, 'messageText')}
						required
					>
						{this.state.messageText}
					</textarea>
				</div>
				<div className='inbox-sendmessage-textarea-bottom-container'>
					<div className='inbox-sendmessage-button-send-container'>
						<input
							id='inbox-sendmessage-button-send'
							className='inbox-sendmessage-button-send'
							type='submit'
							value='Gönder'
						/>
					</div>
				</div>
			</form>
		);
		return (
			<div className='inbox-container'>
				{usersArea}
				{messagesArea}
				{sendmessageArea}
			</div>
		);
	}
}

export default connect(mapStateToProps)(Inbox);
