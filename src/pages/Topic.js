import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import AdSense from 'react-adsense'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faAngleUp,
	faAngleDown,
	faShareAlt,
	faCamera,
	faMapMarkedAlt,
	faCalendarAlt,
	faClock,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/tr';

import Spinner from '../components/Spinner';
import SinglePost from '../components/SinglePost';
import Venue from './Venue';
import { PostFormValidators } from '../components/FormValidators';
import {
	resetValidators,
	updateValidators,
	isFormValid,
} from '../utils/commons';
import { API_DIRECTORY } from '../utils/constants';
import '../styles/Topic.scss';
import '../styles/SinglePost.scss';
import '../styles/App.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

class PostList extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const responsePostList = this.props.responsePostList;
		const Topic = this.props.Topic;
		if (responsePostList === undefined) {
			return null;
		}
		const Posts = responsePostList.Posts;
		return (
			<div className='postlist-container'>
				{Posts &&
					Posts.map((post, index) => {
						return (
							<div key={post.post_id}>
								<SinglePost
									Post={post}
									getPosts={this.props.getPosts}
									updateModal={this.props.updateModal}
									openDialog={this.props.openDialog}
									isPostEventsFirstPost={
										Topic.Category.isEvent === 1 && index === 0 ? true : false
									}
								/>
								{Topic.Category &&
									Topic.Category.isEvent === 1 &&
									Topic.source_link !== null &&
									index === 0 && (
										<a
											href={Topic.source_link}
											target='_blank'
											rel='noreferrer'
										>
											<div className='topic-source-link'>
												<div className='topic-source-link-text'>
													{Topic.City.city_id === 82 && Topic.isFree
														? 'Yayına Git'
														: 'Bilgi Al'}
												</div>
											</div>
										</a>
									)}
							</div>
						);
					})}
			</div>
		);
	}
}

class PostTextArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			posttextarea: '',
			uploading: false,
		};
		this.validators = PostFormValidators;
		resetValidators(this.validators);
		// this.handleInputChange = this.handleInputChange.bind(this);
		// this.updateValidators = this.updateValidators.bind(this);
		// this.resetValidators = this.resetValidators.bind(this);
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

	componentDidUpdate(prevProps) {
		if (
			this.props.location !== prevProps.location ||
			this.props.User !== prevProps.User
		) {
			this.setState({
				posttextarea: '',
			});
		}
	}

	handleAddSpoiler = () => {
		let textArea = document.getElementById('topic-textarea');
		let wholeText = textArea.value;
		let selectedText = wholeText.slice(
			textArea.selectionStart,
			textArea.selectionEnd
		);
		let newText =
			wholeText.slice(0, textArea.selectionStart) +
			'—Spoiler—\n\n' +
			selectedText +
			'\n\n—Spoiler—' +
			wholeText.slice(textArea.selectionEnd);
		this.setState({
			posttextarea: newText,
		});
		//TODO cursor
	};

	handleOpenPhotoList = () => {
		document.getElementById('topic-uploadphoto').click();
	};
	handleSelectPhoto = () => {
		let fileTypes = ['image/jpeg', 'image/pjpeg', 'image/png'];

		function validFileType(file) {
			for (let i = 0; i < fileTypes.length; i++) {
				if (file.type === fileTypes[i]) {
					return true;
				}
			}
			return false;
		}
		function returnFileSize(number) {
			if (number < 1024) {
				return number + 'byte';
			} else if (number >= 1024 && number < 1048576) {
				return (number / 1024).toFixed(1) + 'KB';
			} else if (number >= 1048576) {
				return (number / 1048576).toFixed(1) + 'MB';
			}
		}

		let input = document.querySelector('.topic-uploadphoto');
		let preview = document.querySelector('.topic-uploadphoto-preview');
		let buttonInfoWrapper = document.querySelector(
			'.topic-button-info-wrapper'
		);

		while (preview.firstChild) {
			preview.removeChild(preview.firstChild);
		}
		let curFiles = input.files;
		if (curFiles.length === 0) {
			let photoInfo = document.createElement('span');
			photoInfo.classList.add('topic-uploadphoto-info');
			photoInfo.textContent = 'Seçili fotoğraf yok';
			preview.appendChild(photoInfo);
			buttonInfoWrapper.style.display = 'none';
		} else {
			for (let i = 0; i < curFiles.length; i++) {
				let photoPreviewWrapper = document.createElement('div');
				photoPreviewWrapper.classList.add(
					'topic-uploadphoto-photopreview-wrapper'
				);
				let photoInfo = document.createElement('p');
				photoInfo.classList.add('topic-uploadphoto-info');
				if (validFileType(curFiles[i])) {
					if (curFiles[i].size > 10 * 1048576) {
						photoInfo.textContent = "Seçili fotoğrafın boyutu 10 MB'ı aşamaz.";
						preview.appendChild(photoInfo);
						return;
					}
					photoInfo.textContent =
						curFiles[i].name + ', ' + returnFileSize(curFiles[i].size) + '.';
					let image = document.createElement('img');
					image.classList.add('topic-uploadphoto-photopreview');
					image.src = window.URL.createObjectURL(curFiles[i]);
					buttonInfoWrapper.style.display = 'block';

					photoPreviewWrapper.appendChild(image);
				} else {
					photoInfo.textContent =
						curFiles[i].name +
						': Geçerli dosya tipi değil. Lütfen seçiminizi değiştirin.';
					photoInfo.classList.add('topic-uploadphoto-info');
				}

				preview.appendChild(photoPreviewWrapper);
				preview.appendChild(photoInfo);
				preview.style.display = 'inline-block';
			}
		}
	};

	insertPost = (e) => {
		e.preventDefault();
		if (isFormValid(this.validators)) {
			let postform = document.getElementById('topic-form');
			let form_data = new FormData(postform);
			form_data.append('topic_id', this.props.topicid);
			this.setState({ uploading: true });
			fetch(API_DIRECTORY + '/insertPost', {
				method: 'post',
				body: form_data,
				credentials: 'include',
			})
				.then((res) => {
					if (res.status === 200) return res.json();
					else return { error: 'there was an error with response' };
				})
				.then((responseInsertPost) => {
					if (responseInsertPost.status === 'success') {
						this.setState({ posttextarea: '' });
						this.props.updateLeftFrame();
						this.props.handleInsertPost();
					} else {
						this.props.openDialog(
							responseInsertPost.status,
							responseInsertPost.message
						);
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

	render() {
		const spinner = this.state.uploading ? (
			<div className='topic-spinner'>
				<Spinner />
			</div>
		) : null;
		return (
			<form className='topic-form' id='topic-form' onSubmit={this.insertPost}>
				{spinner}
				<div className='topic-textarea-container'>
					<textarea
						id='topic-textarea'
						className='topic-textarea'
						name='post_text'
						value={this.state.posttextarea}
						placeholder={
							'Siz de ' + this.props.topic.topic_title + ' hakkında yazın.'
						}
						rows='10'
						onInvalid={(e) => this.handleInputChange(e, 'posttextarea')}
						onChange={(e) => this.handleInputChange(e, 'posttextarea')}
						required
					>
						{this.state.posttextarea}
					</textarea>
				</div>
				<div className='topic-textarea-bottom-container'>
					<div className='topic-helpers-wrapper'>
						<div className='topic-visiblehelpers-wrapper'>
							<div
								className='topic-uploadphoto-button-wrapper'
								onClick={this.handleOpenPhotoList}
							>
								<FontAwesomeIcon icon={faCamera} color='#2F2F3C' size='lg' />
							</div>
							<input
								type='file'
								id='topic-uploadphoto'
								className='topic-uploadphoto'
								name='post_photo'
								onChange={this.handleSelectPhoto}
								accept='image/*'
							/>
							<div className='topic-addspoiler-button-wrapper'>
								<input
									id='topic-addspoiler-button'
									className='topic-addspoiler-button'
									type='button'
									value='+ Spoiler'
									onClick={this.handleAddSpoiler}
								/>
							</div>
						</div>
						<div className='topic-uploadphoto-preview-wrapper'>
							<div className='topic-button-info-wrapper'>
								<p>Seçiminizi değiştirmek için tekrar tıklayın.</p>
							</div>
							<div className='topic-uploadphoto-preview'>
								<p>Seçili fotoğraf yok</p>
							</div>
						</div>
					</div>
					<div className='topic-button-send-container'>
						<input
							id='topic-button-send'
							className='topic-button-send'
							type='submit'
							value='Gönder'
						/>
					</div>
				</div>
			</form>
		);
	}
}
const PostTextAreaWithRouter = withRouter(PostTextArea);

class Topic extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Topic: null,
			pagination: {
				isPagingHidden: true,
				current_page: 1,
				total_page: 1,
			},
			orderby: 'old',
			titledownloading: true,
			postsdownloading: true,
		};
	}

	componentDidMount() {
		if (this.props.User.id !== null) {
			this.getTopic();
			this.getPosts();
		}
		window.scrollTo(0, 0);
	}
	componentDidUpdate(prevProps) {
		if (
			this.props.location !== prevProps.location ||
			this.props.User !== prevProps.User
		) {
			this.getTopic();
			this.getPosts();
			this.setState({
				pagination: {
					isPagingHidden: true,
					current_page: 1,
					total_page: 1,
				},
			});
		}
		window.scrollTo(0, 0);
	}

	getTopic = () => {
		this.setState({ titledownloading: true });
		fetch(API_DIRECTORY + '/getTopic/' + this.props.match.params.topicid, {
			method: 'get',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseTopic) => {
				if (responseTopic.status === 'success') {
					this.setState({ Topic: responseTopic.Topic });
				} else {
					this.props.openDialog(responseTopic.status, responseTopic.message);
				}
				this.setState({ titledownloading: false });
			});
	};

	getPosts = async (targetpagenumber) => {
		this.setState({ postsdownloading: true });
		const res = await fetch(
			API_DIRECTORY + '/getPosts/' + this.props.match.params.topicid,
			{
				method: 'post',
				headers: {
					'content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify({
					targetpagenumber: targetpagenumber,
					orderby: this.state.orderby,
				}),
				credentials: 'include',
			}
		);
		const responsePostList = await res.json();
		if (responsePostList.status === 'success') {
			this.setState({ responsePostList });
			if (responsePostList.totalpostcount > 10)
				this.setState({
					pagination: {
						...this.state.pagination,
						isPagingHidden: false,
						total_page: Math.ceil(responsePostList.totalpostcount / 10),
					},
				});
		} else {
			this.props.openDialog(responsePostList.status, responsePostList.message);
		}
		this.setState({ postsdownloading: false });
	};

	resetPagination = () => {
		this.setState({
			pagination: {
				isPagingHidden: true,
				current_page: 1,
				total_page: 1,
			},
		});
	};

	handleClickPaginationPreviousPage = () => {
		if (this.state.pagination.current_page - 1 >= 1) {
			this.setState({
				pagination: {
					...this.state.pagination,
					current_page: this.state.pagination.current_page - 1,
				},
			});
			this.getPosts(this.state.pagination.current_page - 1);
		}
	};
	handleClickPaginationCustomPage = () => {};
	handleClickPaginationFinalPage = () => {
		this.setState({
			pagination: {
				...this.state.pagination,
				current_page: this.state.pagination.total_page,
			},
		});
		this.getPosts(this.state.pagination.total_page);
	};
	handleClickPaginationNextPage = () => {
		if (
			this.state.pagination.current_page + 1 <=
			this.state.pagination.total_page
		) {
			this.setState({
				pagination: {
					...this.state.pagination,
					current_page: this.state.pagination.current_page + 1,
				},
			});
			this.getPosts(this.state.pagination.current_page + 1);
		}
	};

	handleInsertPost = (e) => {
		let target_page = this.state.pagination.total_page;
		if (!(this.state.responsePostList.totalpostcount % 10)) {
			target_page = this.state.pagination.total_page + 1;
		}
		this.setState({
			pagination: {
				...this.state.pagination,
				current_page: target_page,
			},
		});
		this.getPosts(target_page);
	};

	handleSelectOrderby = async (e) => {
		this.resetPagination();
		let newstate = await this.setState({ orderby: e.currentTarget.value });
		this.getPosts();
	};

	handleClickAttendanceDeclaration = async (e) => {
		if (this.props.User.id === 0) {
			this.props.openDialog(
				'info',
				'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
			);
			return;
		}

		let userDeclaration = document.querySelector(
			'.topic-attendance-userdeclaration'
		);
		let userDeclarationText = document.querySelector(
			'.topic-attendance-userdeclaration-text'
		);
		let userDeclarationActive = document.querySelector(
			'.topic-attendance-userdeclaration-active'
		);
		let userDeclarationActiveText = document.querySelector(
			'.topic-attendance-userdeclaration-active-text'
		);
		if (userDeclaration) {
			userDeclaration.classList.add('topic-attendance-userdeclaration-active');
			userDeclaration.classList.remove('topic-attendance-userdeclaration');
			userDeclarationText.classList.add(
				'topic-attendance-userdeclaration-active-text'
			);
			userDeclarationText.classList.remove(
				'topic-attendance-userdeclaration-text'
			);
			let attendanceCount = document.querySelector('.topic-attendance-count');
			let newCount = parseInt(attendanceCount.innerHTML) + 1;
			attendanceCount.innerHTML = newCount;
		} else {
			userDeclarationActive.classList.add('topic-attendance-userdeclaration');
			userDeclarationActive.classList.remove(
				'topic-attendance-userdeclaration-active'
			);
			userDeclarationActiveText.classList.add(
				'topic-attendance-userdeclaration-text'
			);
			userDeclarationActiveText.classList.remove(
				'topic-attendance-userdeclaration-active-text'
			);
			let attendanceCount = document.querySelector('.topic-attendance-count');
			let newCount = parseInt(attendanceCount.innerHTML) - 1;
			attendanceCount.innerHTML = newCount;
		}

		const res = await fetch(API_DIRECTORY + '/declareEventAttendance', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				topic_id: this.state.Topic.topic_id,
			}),
			credentials: 'include',
		});
		const responseDeclareAttendance = await res.json();
		this.props.openDialog(
			responseDeclareAttendance.status,
			responseDeclareAttendance.message
		);
	};

	handleClickHashtag = async (e) => {
		if (this.props.User.id === 0) {
			this.props.openDialog(
				'info',
				'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
			);
			return;
		}

		let selectedHashtag = e.currentTarget;
		if (selectedHashtag.classList.contains('topic-hashtag-active-container')) {
			selectedHashtag.classList.remove('topic-hashtag-active-container');
		} else {
			selectedHashtag.classList.add('topic-hashtag-active-container');
		}

		let hashtagid = selectedHashtag.dataset.hashtagid;

		const res = await fetch(API_DIRECTORY + '/followHashtag', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				hashtag_id: hashtagid,
			}),
			credentials: 'include',
		});
		const responsefollowHashtag = await res.json();
		this.props.openDialog(
			responsefollowHashtag.status,
			responsefollowHashtag.message
		);
	};

	render() {
		const topicId = this.props.match.params.topicid;
		const Topic = this.state.Topic;
		if (Topic == null || topicId == null) {
			return null;
		}
		const titleArea = this.state.titledownloading ? (
			<div className='topic-title-container'>
				<div className='topic-title-wrapper'>
					<h1 className='topic-title-skeleton'></h1>
				</div>
			</div>
		) : (
			<>
				<div className='rekl-container'>
					{/* <AdSense.Google
        className="adsbygoogle"
        client='ca-pub-5093736351800898'
        slot='5013158262'
        layout='in-article'
        format='fluid'
      /> */}
					{/*
      <ins className="adsbygoogle"
       data-ad-layout="in-article"
       data-ad-format="fluid"
       data-ad-client="ca-pub-5093736351800898"
       data-ad-slot="5013158262">
      </ins>
      */}
				</div>
				<div className='topic-title-container'>
					<div className='topic-title-wrapper'>
						{Topic.Category.isEvent === 0 ? (
							<h1 key={topicId} className='topic-title'>
								{Topic.topic_title} ({Topic.Category.category_name})
							</h1>
						) : (
							<h1 key={topicId} className='topic-title'>
								{Topic.topic_title}
							</h1>
						)}
						{Topic.Venue || Topic.start_date ? (
							<div className='topic-info-container'>
								{Topic.Venue ? (
									<span className='topic-venue-wrapper'>
										<span className='topic-venue-icon'>
											<FontAwesomeIcon icon={faMapMarkedAlt} color='#2F2F3C' />
										</span>
										<span className='topic-venue'>
											{' '}
											{Topic.Venue.venue_title}
										</span>
									</span>
								) : null}
								{Topic.start_date ? (
									<span className='topic-time-wrapper'>
										<span className='topic-date-wrapper'>
											<span className='topic-date-icon'>
												<FontAwesomeIcon icon={faCalendarAlt} color='#2F2F3C' />
											</span>
											<span className='topic-date'>
												{Topic.end_date
													? moment(Topic.start_date).format('Do MMMM') ===
													  moment(Topic.end_date).format('Do MMMM')
														? moment(Topic.start_date).format(
																'Do MMMM YYYY dddd'
														  ) + ' '
														: moment(Topic.start_date).format('MMMM') ===
														  moment(Topic.end_date).format('MMMM')
														? moment(Topic.start_date).format('Do') +
														  '-' +
														  moment(Topic.end_date).format('Do MMMM YYYY')
														: moment(Topic.start_date).format('Do MMMM') +
														  '-' +
														  moment(Topic.end_date).format('Do MMMM YYYY')
													: moment(Topic.start_date).format(
															'Do MMMM YYYY dddd'
													  ) + ' '}
											</span>
										</span>
										<span className='topic-clock-wrapper'>
											<span className='topic-clock-icon'>
												<FontAwesomeIcon icon={faClock} color='#2F2F3C' />
											</span>
											<span className='topic-clock'>
												{' '}
												{moment(Topic.start_date).format('HH:mm')}
											</span>
										</span>
									</span>
								) : null}
							</div>
						) : null}
					</div>
				</div>
			</>
		);

		const topbarArea = this.state.titledownloading
			? null
			: Topic.Category.isEvent === 1 && (
					<div className='topic-topbar-container topic-topbar-topicinfo-container'>
						<div className='topic-topbar topic-topbar-topicinfo'>
							<div className='topic-attendance-container'>
								<div className='topic-attendance-count'>
									{Topic.totalAttendance}
								</div>
								<div className='topic-attendance-count-text'>
									&nbsp;katılımcı
								</div>
								{Topic.isUserAnAttandee === false && (
									<div
										className='topic-attendance-userdeclaration'
										onClick={this.handleClickAttendanceDeclaration}
									>
										<div className='topic-attendance-userdeclaration-text'></div>
									</div>
								)}
								{Topic.isUserAnAttandee === true && (
									<div
										className='topic-attendance-userdeclaration-active'
										onClick={this.handleClickAttendanceDeclaration}
									>
										<div className='topic-attendance-userdeclaration-active-text'></div>
									</div>
								)}
							</div>
						</div>
					</div>
			  );

		const hashtagArea =
			this.state.titledownloading ||
			(Topic.hashtags && Topic.hashtags.length === 0)
				? null
				: Topic.Category.isEvent === 1 && (
						<div className='topic-topbar-container topic-topbar-hashtag-container'>
							<div className='topic-topbar topic-topbar-hashtag'>
								<div className='topic-hashtags-container'>
									<div className='topic-hashtags-info'>
										Etiketleri takip et, yeni etkinliklerden haberdar ol!
									</div>
									{Topic.hashtags.map((Hashtag) =>
										Hashtag.isUserFollower ? (
											<div
												className='topic-hashtag-container topic-hashtag-active-container'
												key={'hashtag' + Hashtag.hashtag_id}
												data-hashtagid={Hashtag.hashtag_id}
												onClick={this.handleClickHashtag}
											>
												<div className='topic-hashtag-text'>
													&nbsp;{Hashtag.Hashtag.hashtag_name}
												</div>
											</div>
										) : (
											<div
												className='topic-hashtag-container'
												key={'hashtag' + Hashtag.hashtag_id}
												data-hashtagid={Hashtag.hashtag_id}
												onClick={this.handleClickHashtag}
											>
												<div className='topic-hashtag-text'>
													&nbsp;{Hashtag.Hashtag.hashtag_name}
												</div>
											</div>
										)
									)}
								</div>
							</div>
						</div>
				  );

		const postsArea = this.state.postsdownloading ? (
			[...Array(1)].map((x, i) => (
				<div className='singlepost-container' key={i}>
					<span className='singlepost-text-wrapper'>
						<span className='singlepost-text-skeleton'></span>
					</span>
					<div className='singlepost-bottom-area'>
						<div className='singlepost-social-wrapper'>
							<div className='singlepost-vote-container'>
								<span className='singlepost-upvote-container'>
									<span className='singlepost-vote-upvote'>
										<FontAwesomeIcon icon={faAngleUp} color='#FFF' />
									</span>
									<span className='singlepost-vote-upvotecount-skeleton'></span>
								</span>
								<span className='singlepost-downvote-container'>
									<span className='singlepost-vote-downvote'>
										<FontAwesomeIcon icon={faAngleDown} color='#FFF' />
									</span>
									<span className='singlepost-vote-downvotecount-skeleton'></span>
								</span>
								<span className='singlepost-social-container'>
									<span className='singlepost-social-share'>
										<FontAwesomeIcon icon={faShareAlt} color='#2F2F3C' />
									</span>
								</span>
							</div>
						</div>
						<div className='singlepost-info-wrapper'>
							<div className='singlepost-user-wrapper'>
								<span className='singlepost-username-skeleton'></span>
							</div>
						</div>
					</div>
				</div>
			))
		) : (
			<PostList
				User={this.props.User}
				Topic={Topic}
				responsePostList={this.state.responsePostList}
				getPosts={this.getPosts}
				updateModal={this.props.updateModal}
				openDialog={this.props.openDialog}
			/>
		);

		const venueArea = this.state.Topic.Venue ? (
			<Venue venueid={this.state.Topic.Venue.venue_id} />
		) : null;

		const isLoggedIn = this.props.User.id;
		const postTextArea = isLoggedIn ? (
			<PostTextAreaWithRouter
				topicid={topicId}
				topic={Topic}
				openDialog={this.props.openDialog}
				handleInsertPost={this.handleInsertPost}
				updateLeftFrame={this.props.updateLeftFrame}
			/>
		) : null;

		const topicJson = Topic.Category.isEvent
			? {
					'@context': 'https://schema.org',
					'@type': 'Event',
					name: Topic.topic_title,
					startDate: Topic.start_date,
					endDate: Topic.end_date ? Topic.end_date : null,
					eventAttendanceMode:
						Topic.City.city_id == 82
							? 'OnlineEventAttendanceMode'
							: 'OfflineEventAttendanceMode',
					location:
						Topic.City.city_id == 82
							? {
									'@type': 'VirtualLocation',
									url: Topic.source_link ? Topic.source_link : null,
							  }
							: {
									'@type': 'Place',
									name: Topic.Venue ? Topic.Venue.venue_title : null,
									address: {
										'@type': 'PostalAddress',
										addressRegion: Topic.Venue ? Topic.Venue.venue_title : null,
									},
							  },
			  }
			: null;

		return (
			<>
				<Helmet>
					<title>{Topic.topic_title} | Şallı Turna</title>
				</Helmet>
				{Topic.Category.isEvent === 1 && (
					<Helmet>
						<script type='application/ld+json'>
							{JSON.stringify(topicJson)}
						</script>
					</Helmet>
				)}
				<div className='topic-container'>
					<div className='topicposts-container'>
						{titleArea}
						{topbarArea}
						{hashtagArea}
						<div className='topic-topbar-container topic-topbar-postsinfo-container'>
							<div className='topic-topbar topic-topbar-postsinfo'>
								<div className='topic-orderby-container'>
									<select
										className='topic-orderby-dropdown'
										onChange={this.handleSelectOrderby}
									>
										<option value='old'>Tarihe göre sıralı</option>
										<option value='best'>Oylara göre sıralı</option>
									</select>
									<span className='topic-orderby-icon'>
										<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
									</span>
								</div>
								<div
									className='topic-paging'
									style={{
										display: this.state.pagination.isPagingHidden
											? 'none'
											: 'block',
									}}
								>
									<span
										className='topic-paging-page topic-paging-previouspage'
										onClick={this.handleClickPaginationPreviousPage}
									>
										&#8249;
									</span>
									<span
										className='topic-paging-page topic-paging-currentpage'
										onClick={this.handleClickPaginationCustomPage}
									>
										{this.state.pagination.current_page}
									</span>
									/
									<span
										className='topic-paging-page topic-paging-finalpage'
										onClick={this.handleClickPaginationFinalPage}
									>
										{this.state.pagination.total_page}
									</span>
									<span
										className='topic-paging-page topic-paging-nextpage'
										onClick={this.handleClickPaginationNextPage}
									>
										&#8250;
									</span>
								</div>
							</div>
						</div>
						{postsArea}
						{postTextArea}
					</div>
					{venueArea}
				</div>
			</>
		);
	}
}

export default connect(mapStateToProps)(Topic);
