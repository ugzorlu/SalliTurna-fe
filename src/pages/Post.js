import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faAngleUp,
	faAngleDown,
	faShareAlt,
	faCamera,
} from '@fortawesome/free-solid-svg-icons';
import { Image } from 'cloudinary-react';

import Spinner from '../components/Spinner';
import SinglePost from '../components/SinglePost';
import { PostFormValidators } from '../components/FormValidators';
import {
	resetValidators,
	updateValidators,
	isFormValid,
} from '../utils/commons';
import { API_DIRECTORY } from '../utils/constants';
import '../styles/Topic.scss';
import '../styles/Post.scss';
import '../styles/SinglePost.scss';
import '../styles/App.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

class PostTextArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			posttextarea: props.Post.post_text,
		};
		this.validators = PostFormValidators;
		resetValidators(this.validators);
		// this.handleInputChange = this.handleInputChange.bind(this);
		// this.updateValidators = this.updateValidators.bind(this);
		// this.resetValidators = this.resetValidators.bind(this);
		this.validators = updateValidators(
			this.validators,
			'posttextarea',
			props.Post.post_text
		);
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

	handleOpenPhotoList = () => {
		document.getElementById('post-uploadphoto').click();
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

		let input = document.querySelector('.post-uploadphoto');
		let previewWrapper = document.querySelector(
			'.post-uploadphoto-preview-wrapper'
		);
		let preview = document.querySelector('.post-uploadphoto-preview');
		let buttonInfoWrapper = document.querySelector('.post-button-info-wrapper');
		// let button = document.querySelector('.topicdraftform-uploadphoto-button-wrapper')

		while (preview.firstChild) {
			preview.removeChild(preview.firstChild);
		}
		let curFiles = input.files;
		if (curFiles.length === 0) {
			let photoInfo = document.createElement('span');
			photoInfo.classList.add('post-uploadphoto-info');
			photoInfo.textContent = 'Seçili fotoğraf yok';
			preview.appendChild(photoInfo);
			buttonInfoWrapper.style.display = 'none';
		} else {
			for (let i = 0; i < curFiles.length; i++) {
				let photoPreviewWrapper = document.createElement('div');
				photoPreviewWrapper.classList.add(
					'post-uploadphoto-photopreview-wrapper'
				);
				let photoInfo = document.createElement('p');
				photoInfo.classList.add('post-uploadphoto-info');
				if (validFileType(curFiles[i])) {
					if (curFiles[i].size > 10 * 1048576) {
						photoInfo.textContent = "Seçili fotoğrafın boyutu 10 MB'ı aşamaz.";
						preview.appendChild(photoInfo);
						return;
					}
					photoInfo.textContent =
						curFiles[i].name + ', ' + returnFileSize(curFiles[i].size) + '.';
					let image = document.createElement('img');
					image.classList.add('post-uploadphoto-photopreview');
					image.src = window.URL.createObjectURL(curFiles[i]);
					buttonInfoWrapper.style.display = 'block';

					photoPreviewWrapper.appendChild(image);
				} else {
					photoInfo.textContent =
						curFiles[i].name +
						': Geçerli dosya tipi değil. Lütfen seçiminizi değiştirin.';
					photoInfo.classList.add('post-uploadphoto-info');
				}

				preview.appendChild(photoPreviewWrapper);
				preview.appendChild(photoInfo);
				preview.style.display = 'inline-block';
			}
		}
	};

	handleUpdatePost = (e) => {
		e.preventDefault();
		if (isFormValid(this.validators)) {
			this.props.updatePost();
		}
	};

	render() {
		const postPhoto = this.props.Post.post_photo ? (
			<div className='post-photo-wrapper'>
				<Image
					cloudName='di6klblik'
					publicId={this.props.Post.post_photo}
					width='50%'
				/>
			</div>
		) : (
			<p>Seçili fotoğraf yok</p>
		);

		return (
			<form className='post-form' id='post-form'>
				<div className='post-textarea-container'>
					<textarea
						className='post-textarea'
						name='post_text'
						value={this.state.posttextarea}
						placeholder='Siz de bu konu hakkında bilgi verin.'
						rows='10'
						onInvalid={(e) => this.handleInputChange(e, 'posttextarea')}
						onChange={(e) => this.handleInputChange(e, 'posttextarea')}
						required
					>
						{this.state.posttextarea}
					</textarea>
				</div>
				<div className='post-textarea-bottom-container'>
					<div
						className='post-uploadphoto-button-wrapper'
						onClick={this.handleOpenPhotoList}
					>
						<FontAwesomeIcon icon={faCamera} color='#2F2F3C' size='lg' />
					</div>
					<input
						type='file'
						id='post-uploadphoto'
						className='post-uploadphoto'
						name='post_photo'
						onChange={this.handleSelectPhoto}
						accept='image/*'
					/>
					<div className='post-uploadphoto-preview-wrapper'>
						<div className='post-button-info-wrapper'>
							<p>Seçiminizi değiştirmek için tekrar tıklayın.</p>
						</div>
						<div className='post-uploadphoto-preview'>{postPhoto}</div>
					</div>
					<div className='post-button-cancel-container'>
						<input
							id='post-button-cancel'
							className='post-button-cancel'
							onClick={this.props.hidePostTextArea}
							type='button'
							value='Vazgeç'
						/>
					</div>
					<div className='post-button-send-container'>
						<input
							id='post-button-send'
							className='post-button-send'
							onClick={this.handleUpdatePost}
							type='submit'
							value='Gönder'
						/>
					</div>
				</div>
			</form>
		);
	}
}

class Post extends Component {
	constructor(props) {
		super(props);
		if (this.props.location.hash == '#edit') {
			this.state = {
				isSinglePostHidden: true,
				isPostTextAreaHidden: false,
				downloading: true,
				uploading: false,
			};
		} else {
			this.state = {
				isSinglePostHidden: false,
				isPostTextAreaHidden: true,
				downloading: true,
				uploading: false,
			};
		}

		// this.showPostTextArea = this.showPostTextArea.bind(this);
		// this.hidePostTextArea = this.hidePostTextArea.bind(this);
	}

	componentDidMount() {
		if (this.props.User.id !== null) {
			this.getPost(this.props.match.params.postid);
		}
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.getPost(this.props.match.params.postid);
			window.scrollTo(0, 0);
		}
	}

	getPost = async (post_id) => {
		this.setState({ downloading: true });
		const res = await fetch(API_DIRECTORY + '/getPost/' + post_id, {
			method: 'get',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			credentials: 'include',
		});
		const responsePost = await res.json();
		if (responsePost.status === 'success') {
			this.setState({ responsePost });
		} else {
			this.props.openDialog(responsePost.status, responsePost.message);
		}
		this.setState({ downloading: false });
	};

	updatePost = () => {
		let postform = document.getElementById('post-form');
		let form_data = new FormData(postform);
		form_data.append('post_id', this.state.responsePost.Post.post_id);
		this.setState({ uploading: true });
		fetch(API_DIRECTORY + '/updatePost', {
			method: 'post',
			body: form_data,
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseUpdatePost) => {
				if (responseUpdatePost.status === 'success') {
					this.props.history.push(
						'/topic/' + this.state.responsePost.Post.Topic.topic_id
					);
				} else {
					this.props.openDialog(
						responseUpdatePost.status,
						responseUpdatePost.message
					);
				}
				this.setState({ uploading: false });
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	showPostTextArea = (e) => {
		this.setState({ isPostTextAreaHidden: false, isSinglePostHidden: true });
	};
	hidePostTextArea = (e) => {
		this.setState({ isPostTextAreaHidden: true, isSinglePostHidden: false });
	};

	render() {
		const responsePost = this.state.responsePost;
		if (responsePost == null || responsePost.Post == null) {
			return null;
		}
		const Post = this.state.responsePost.Post;

		const isUserLoggedIn = this.props.User.id;
		let isUserThePostOwner;
		if (isUserLoggedIn) {
			isUserThePostOwner = isUserLoggedIn === Post.User.user_id ? true : false;
		}
		const post = this.state.downloading ? (
			<div className='profile-posts-skeleton-container'>
				<div className='topic-title-container'>
					<div className='topic-title-wrapper'>
						<h1 className='topic-title-skeleton'></h1>
					</div>
				</div>
				<div className='singlepost-container'>
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
			</div>
		) : (
			<div className=''>
				<div className='topic-title-container'>
					<div className='topic-title-wrapper'>
						{responsePost !== null && (
							<Link to={{ pathname: '/topic/' + Post.Topic.topic_id }}>
								{Post.Topic.Category.isEvent === 0 ? (
									<h1 key={Post.Topic.topic_id} className='topic-title'>
										{Post.Topic.topic_title} (
										{Post.Topic.Category.category_name})
									</h1>
								) : (
									<h1 key={Post.Topic.topic_id} className='topic-title'>
										{Post.Topic.topic_title}
									</h1>
								)}
							</Link>
						)}
					</div>
				</div>
				<div
					className='postlist-container'
					style={{ display: this.state.isSinglePostHidden ? 'none' : 'block' }}
				>
					<SinglePost
						key={Post.post_id}
						Post={Post}
						showPostTextArea={this.showPostTextArea}
						getPost={this.getPost}
						openDialog={this.props.openDialog}
						updateModal={this.props.updateModal}
					/>
				</div>
			</div>
		);

		const spinner = this.state.uploading ? (
			<div className='post-spinner'>
				<Spinner />
			</div>
		) : null;
		const postTextArea =
			isUserLoggedIn && isUserThePostOwner ? (
				<div
					className='post-form-container'
					style={{
						display: this.state.isPostTextAreaHidden ? 'none' : 'block',
					}}
				>
					{spinner}
					<PostTextArea
						Post={Post}
						posttextarea={Post.post_text}
						hidePostTextArea={this.hidePostTextArea}
						updatePost={this.updatePost}
						openDialog={this.props.openDialog}
					/>
				</div>
			) : null;

		return (
			<div className='post-container'>
				{post}
				{postTextArea}
			</div>
		);
	}
}

export default connect(mapStateToProps)(Post);
