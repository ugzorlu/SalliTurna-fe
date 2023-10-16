import React, { Component } from 'react';
// import ReactDOMServer from 'react-dom/server'
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Image } from 'cloudinary-react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleUp,
	faAngleDown,
	faShareAlt,
	faExclamation,
	faCaretDown,
	faEnvelope,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { TwitterTweetEmbed } from 'react-twitter-embed';
import Linkify from 'linkifyjs/react';
import Moment from 'react-moment';
import 'moment-timezone';
Moment.globalLocale = 'tr';

import Spinner from './Spinner';
import { PostFormValidators } from './FormValidators';
import { API_DIRECTORY, WEB_DIRECTORY } from '../utils/constants';
import { calendarStrings, calendarStringsInSameDay } from '../utils/constants';
import '../styles/App.scss';
import '../styles/SinglePost.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

class SinglePost extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isPostActionsDropdownHidden: true,
			isPostSocialDropdowHidden: true,
			isPostUpVotedByUser: false,
			isPostDownVotedByUser: false,
			// uploadingupvote: false,
			// uploadingdownvote: false
			// ,
			// votes:
			// {
			//   upvote_count: 0,
			//   downvote_count: 0
			// }
		};
	}

	toggleEditDeletePost = () => {
		this.setState({
			isPostActionsDropdownHidden: !this.state.isPostActionsDropdownHidden,
		});
	};
	handleClickOutsidePostActions = (e) => {
		const postActionsDropdown = document.getElementById(
			'singlepost-actions-dropdown'
		);
		if (
			null !== postActionsDropdown &&
			!postActionsDropdown.contains(e.target)
		) {
			this.setState({ isPostActionsDropdownHidden: true });
		}
	};

	toggleShare = () => {
		this.setState({
			isPostSocialDropdowHidden: !this.state.isPostSocialDropdowHidden,
		});
	};
	handleClickOutsidePostShare = (e) => {
		const postSocialDropdown = document.getElementById(
			'singlepost-social-dropdown'
		);
		if (null !== postSocialDropdown && !postSocialDropdown.contains(e.target)) {
			this.setState({
				isPostSocialDropdowHidden: true,
			});
		}
	};

	componentDidMount() {
		document.addEventListener(
			'click',
			this.handleClickOutsidePostActions,
			true
		);
		document.addEventListener(
			'touchstart',
			this.handleClickOutsidePostActions,
			true
		);
		document.addEventListener('click', this.handleClickOutsidePostShare, true);
		document.addEventListener(
			'touchstart',
			this.handleClickOutsidePostShare,
			true
		);
	}
	componentWillUnmount() {
		document.removeEventListener(
			'click',
			this.handleClickOutsidePostActions,
			true
		);
		document.removeEventListener(
			'touchstart',
			this.handleClickOutsidePostActions,
			true
		);
		document.removeEventListener(
			'click',
			this.handleClickOutsidePostShare,
			true
		);
		document.removeEventListener(
			'touchstart',
			this.handleClickOutsidePostShare,
			true
		);
	}

	deletePost = () => {
		const postid = this.props.Post.post_id;
		const topicid = this.props.Post.Topic.topic_id;

		fetch(API_DIRECTORY + '/deletePost/' + postid, {
			method: 'delete',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				post_id: postid,
				topic_id: topicid,
			}),
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseDeletePost) => {
				this.props.openDialog(
					responseDeletePost.status,
					responseDeletePost.message
				);
				if (responseDeletePost.status === 'success') {
					if (this.props.location.pathname.includes('/topic/')) {
						this.props.getPosts();
					} else {
						this.props.history.push('/topic/' + topicid);
					}
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	handleEditPost = () => {
		if (this.props.history.location.pathname.includes('/post/')) {
			this.props.showPostTextArea();
		} else {
			this.props.history.push({
				pathname: '/post/' + this.props.Post.post_id,
				hash: 'edit',
			});
		}
	};

	handleDeletePost = () => {
		this.props.openDialog(
			'warning',
			'Gönderiyi silmek istediğinize emin misiniz?',
			this.deletePost
		);
	};

	handleUpvote = (e) => {
		// this.setState({ uploadingupvote: true })
		if (this.props.User.id === 0) {
			this.props.openDialog(
				'info',
				'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
			);
			return;
		}

		let currentTarget = e.currentTarget;
		let voteUpvote = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-upvote');
		let voteUpvoteActive = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-upvote-active');
		let voteUpvoteCount = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-upvotecount');

		if (this.state.isPostUpVotedByUser) {
			voteUpvote.classList.remove('singlepost-vote-upvote-active');
			if (voteUpvoteActive) {
				let newCount = parseInt(voteUpvoteCount.innerHTML) - 1;
				voteUpvoteCount.innerHTML = newCount;
				return this.deletePostVote(currentTarget, true);
			}
		}
		if (!voteUpvoteActive) {
			voteUpvote.classList.add('singlepost-vote-upvote-active');
			let newCount = parseInt(voteUpvoteCount.innerHTML) + 1;
			voteUpvoteCount.innerHTML = newCount;
		}

		let voteDowmvoteActive = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-downvote-active');
		let voteDowmvoteCount = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-downvotecount');
		if (voteDowmvoteActive) {
			voteDowmvoteActive.classList.remove('singlepost-vote-downvote-active');
			let newCount = parseInt(voteDowmvoteCount.innerHTML) - 1;
			voteDowmvoteCount.innerHTML = newCount;
		}
		this.insertPostVote(currentTarget, true);
	};
	handleDownvote = (e) => {
		// this.setState({ uploadingdownvote: true })
		if (this.props.User.id === 0) {
			this.props.openDialog(
				'info',
				'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
			);
			return;
		}
		let currentTarget = e.currentTarget;
		let voteDowmvote = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-downvote');
		let voteDowmvoteActive = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-downvote-active');
		let voteDowmvoteCount = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-downvotecount');

		if (this.state.isPostDownVotedByUser) {
			if (voteDowmvoteActive) {
				voteDowmvote.classList.remove('singlepost-vote-downvote-active');
				let newCount = parseInt(voteDowmvoteCount.innerHTML) - 1;
				voteDowmvoteCount.innerHTML = newCount;
			}
			return this.deletePostVote(currentTarget, false);
		}
		if (!voteDowmvoteActive) {
			voteDowmvote.classList.add('singlepost-vote-downvote-active');
			let newCount = parseInt(voteDowmvoteCount.innerHTML) + 1;
			voteDowmvoteCount.innerHTML = newCount;
		}

		let voteUpvoteActive = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-upvote-active');
		let voteUpvoteCount = e.currentTarget
			.closest('.singlepost-vote-container')
			.querySelector('.singlepost-vote-upvotecount');
		if (voteUpvoteActive) {
			voteUpvoteActive.classList.remove('singlepost-vote-upvote-active');
			let newCount = parseInt(voteUpvoteCount.innerHTML) - 1;
			voteUpvoteCount.innerHTML = newCount;
		}
		this.insertPostVote(currentTarget, false);
	};

	handleShareOnTwitter = () => {
		window.open(
			'https://twitter.com/intent/tweet?url=' +
				WEB_DIRECTORY +
				'/post/' +
				this.props.Post.post_id
		);
	};

	handleShareOnFacebook = () => {
		FB.ui(
			{
				method: 'share',
				href: WEB_DIRECTORY + +'/post/' + this.props.Post.post_id,
			},
			function (response) {}
		);
	};

	handleReport = () => {
		this.props.history.push('/contact?postid=' + this.props.Post.post_id);
	};

	handleSendMessage = (e) => {
		if (this.props.User.id === 0) {
			this.props.openDialog(
				'info',
				'Bu işlemi gerçekleştirmek için giriş yapmalısınız.'
			);
			return;
		}
		let userid = e.currentTarget.dataset.userid;
		this.props.history.push('/inbox?corresponderid=' + userid);
	};

	insertPostVote = async (currentTarget, isUpvote) => {
		const res = await fetch(API_DIRECTORY + '/insertPostVote', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				post_id: this.props.Post.post_id,
				isUpvote: isUpvote,
			}),
			credentials: 'include',
		});
		const responseInsertPostVote = await res.json();
		if (
			responseInsertPostVote != null &&
			responseInsertPostVote.status === 'success'
		) {
			if (isUpvote) {
				this.setState({
					isPostUpVotedByUser: true,
					isPostDownVotedByUser: false,
				});
			} else {
				this.setState({
					isPostUpVotedByUser: false,
					isPostDownVotedByUser: true,
				});
			}
			// if(this.props.location.pathname.includes('/topic/')){
			//   this.props.getPosts()
			// }
			// else if(this.props.location.pathname.includes('/profile/')){
			//   // this.props.getProfile(this.props.match.params.userid)
			// }
			// else{
			//   this.props.getPost(this.props.Post.post_id)
			// }
		} else {
			this.props.openDialog(
				responseInsertPostVote.status,
				responseInsertPostVote.message
			);

			if (isUpvote) {
				let voteUpvote = currentTarget
					.closest('.singlepost-vote-container')
					.querySelector('.singlepost-vote-upvote');
				let voteUpvoteActive = currentTarget
					.closest('.singlepost-vote-container')
					.querySelector('.singlepost-vote-upvote-active');
				let voteUpvoteCount = currentTarget
					.closest('.singlepost-vote-container')
					.querySelector('.singlepost-vote-upvotecount');
				voteUpvote.classList.remove('singlepost-vote-upvote-active');
				let newCount = parseInt(voteUpvoteCount.innerHTML) - 1;
				voteUpvoteCount.innerHTML = newCount;
			} else {
				let voteDowmvote = currentTarget
					.closest('.singlepost-vote-container')
					.querySelector('.singlepost-vote-downvote');
				let voteDowmvoteActive = currentTarget
					.closest('.singlepost-vote-container')
					.querySelector('.singlepost-vote-downvote-active');
				let voteDowmvoteCount = currentTarget
					.closest('.singlepost-vote-container')
					.querySelector('.singlepost-vote-downvotecount');
				voteDowmvote.classList.remove('singlepost-vote-downvote-active');
				let newCount = parseInt(voteDowmvoteCount.innerHTML) - 1;
				voteDowmvoteCount.innerHTML = newCount;
			}
		}
		// this.setState({ uploadingupvote: false, uploadingdownvote: false })

		// .then(res => {
		//   if(res.status === 200) return res.json();
		//   else return { error: 'there was an error with response' }
		// })
		// .then(responseInsertPostVote => {
		//   if(responseInsertPostVote.status === "success"){
		//     if(this.props.location.pathname.includes('/topic/')){
		//       this.props.getPosts()
		//     }
		//     else if(this.props.location.pathname.includes('/profile/')){
		//       this.props.getProfile(this.props.match.params.userid)
		//     }
		//     else{
		//       this.props.getPost(this.props.Post.post_id)
		//     }
		//   }
		//   else{
		//     this.props.openDialog(responseInsertPostVote.status, responseInsertPostVote.message)
		//   }
		// })
	};

	deletePostVote = (currentTarget, isUpvote) => {
		fetch(API_DIRECTORY + '/deletePostVote', {
			method: 'delete',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				post_id: this.props.Post.post_id,
			}),
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseDeletePostVote) => {
				if (responseDeletePostVote.status === 'success') {
					this.setState({
						isPostUpVotedByUser: false,
						isPostDownVotedByUser: false,
					});
				} else {
					this.props.openDialog(
						responseDeletePostVote.status,
						responseDeletePostVote.message
					);
					if (isUpvote) {
						let voteUpvote = currentTarget
							.closest('.singlepost-vote-container')
							.querySelector('.singlepost-vote-upvote');
						let voteUpvoteActive = currentTarget
							.closest('.singlepost-vote-container')
							.querySelector('.singlepost-vote-upvote-active');
						let voteUpvoteCount = currentTarget
							.closest('.singlepost-vote-container')
							.querySelector('.singlepost-vote-upvotecount');
						voteUpvote.classList.add('singlepost-vote-upvote-active');
						let newCount = parseInt(voteUpvoteCount.innerHTML) + 1;
						voteUpvoteCount.innerHTML = newCount;
					} else {
						let voteDowmvote = currentTarget
							.closest('.singlepost-vote-container')
							.querySelector('.singlepost-vote-downvote');
						let voteDowmvoteActive = currentTarget
							.closest('.singlepost-vote-container')
							.querySelector('.singlepost-vote-downvote-active');
						let voteDowmvoteCount = currentTarget
							.closest('.singlepost-vote-container')
							.querySelector('.singlepost-vote-downvotecount');
						voteDowmvote.classList.add('singlepost-vote-downvote-active');
						let newCount = parseInt(voteDowmvoteCount.innerHTML) + 1;
						voteDowmvoteCount.innerHTML = newCount;
					}
				}
				// this.setState({ uploadingupvote: false, uploadingdownvote: false })
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	handleOpenPhotoInModal = () => {
		this.props.updateModal(false, this.props.Post.post_photo);
	};

	getTwitterWidgets = (postText) => {
		let newPostText = postText;
		if (postText.includes('twitter.com/')) {
			let regexForTwitterFirstUrl =
				/((https|http):\/\/)?twitter.com\/[a-zA-Z0-9_]+\/status\/[0-9]+[\/ | \?]?[a-zA-Z0-9=\?\/]*/;
			let regexForTwitterUrls =
				/((https|http):\/\/)?twitter.com\/[a-zA-Z0-9_]+\/status\/[0-9]+[\/ | \?]?[a-zA-Z0-9=\?\/]*/g;
			let twitterUrls = postText.match(regexForTwitterUrls);
			let renderWithWidgets = twitterUrls.map((twitterUrl) => {
				let postTextPosition = postText.search(regexForTwitterFirstUrl);
				let twitterId = twitterUrl
					.replace(
						/((https|http):\/\/)?twitter.com\/[a-zA-Z0-9_]+\/status\//g,
						''
					)
					.replace(/[\/ | \?]+[a-zA-Z0-9=\?\/]*/g, '')
					.trim();
				let newTweet = (
					<div className='singlepost-tweet'>
						<TwitterTweetEmbed tweetId={twitterId} />
					</div>
				);
				newPostText = postText.replace(regexForTwitterFirstUrl, '');
				let postTextBefore = newPostText.substring(0, postTextPosition);
				let postTextAfter = newPostText.substring(postTextPosition);
				return (
					<div>
						{this.getTwitterWidgets(postTextBefore)}
						{newTweet}
						{this.getTwitterWidgets(postTextAfter)}
					</div>
				);
			});
			return renderWithWidgets[0];
		}
		return newPostText;
	};

	render() {
		const post = this.props.Post;
		const postOwner = this.props.Post.User;
		const loggedinUser = this.props.User;
		const isPostEditable = loggedinUser.username === postOwner.user_name;
		// const singlepostActionsDropdownStyle = {
		// 	display: (this.state.isPostActionsDropdownHidden ? 'none' : 'inline-block')
		// }

		const postText = this.getTwitterWidgets(post.post_text);
		const postDate = new Date(post.post_date);
		const postDatePrettyText = (
			<Moment calendar={calendarStrings}>{post.post_date}</Moment>
		);
		const editDate = post.edit_date ? new Date(post.edit_date) : null;
		const isEditSameDay = editDate
			? editDate.getDay() === postDate.getDay()
			: false;
		const editDatePrettyText = editDate ? (
			<Moment
				calendar={isEditSameDay ? calendarStringsInSameDay : calendarStrings}
			>
				{editDate}
			</Moment>
		) : null;

		let singlepostVoteUpvoteClasses = classNames('singlepost-vote-upvote', {
			'singlepost-vote-upvote-active': post.isPostUpVotedByUser,
		});
		let singlepostVoteDownvoteClasses = classNames('singlepost-vote-downvote', {
			'singlepost-vote-downvote-active': post.isPostDownVotedByUser,
		});
		// const upvotespinner = this.state.uploadingupvote ? <span className="singlepost-upvote-spinner"><Spinner /></span> : null
		// const downvotespinner = this.state.uploadingdownvote ? <span className="singlepost-downvote-spinner"><Spinner /></span> : null

		return (
			<div className='singlepost-container'>
				<Helmet>
					{/* <script>
						{`
            window.fbAsyncInit = function() {
              FB.init({
                appId            : '2313213462139273',
                autoLogAppEvents : true,
                xfbml            : false,
                version          : 'v4.0'
              })
            }
           `}
					</script>
					<script async defer src='https://connect.facebook.net/tr_TR/sdk.js' /> */}
				</Helmet>
				{post.post_photo && (
					<div
						className='singlepost-photo-wrapper'
						onClick={this.handleOpenPhotoInModal}
					>
						<Image
							cloudName='di6klblik'
							publicId={post.post_photo}
							width='100%'
						/>
					</div>
				)}
				<div className='singlepost-text-wrapper'>
					<span className='singlepost-text'>
						<Linkify options={{ target: '_blank' }}>{postText}</Linkify>
					</span>
				</div>
				<div
					className='singlepost-bottom-area'
					style={{
						display:
							this.props.isPostEventsFirstPost != null &&
							this.props.isPostEventsFirstPost == true
								? 'none'
								: 'block',
					}}
				>
					>
					<div className='singlepost-social-wrapper'>
						<div className='singlepost-vote-container'>
							<span
								className='singlepost-upvote-container'
								onClick={this.handleUpvote}
							>
								<span className={singlepostVoteUpvoteClasses}>
									<FontAwesomeIcon icon={faAngleUp} color='inherit' />
								</span>
								<span className='singlepost-vote-upvotecount'>
									{post.totalUpvoteCount ? post.totalUpvoteCount : 0}
								</span>
							</span>
							<span
								className='singlepost-downvote-container'
								onClick={this.handleDownvote}
							>
								<span className={singlepostVoteDownvoteClasses}>
									<FontAwesomeIcon icon={faAngleDown} color='inherit' />
								</span>
								<span className='singlepost-vote-downvotecount'>
									{post.totalDownvoteCount ? post.totalDownvoteCount : 0}
								</span>
							</span>
							<span
								className='singlepost-social-container'
								onClick={this.toggleShare}
							>
								<span className='singlepost-social-share'>
									<FontAwesomeIcon icon={faShareAlt} color='#2F2F3C' />
								</span>
								<span
									className='singlepost-social-dropdown'
									id='singlepost-social-dropdown'
									style={{
										display: this.state.isPostSocialDropdowHidden
											? 'none'
											: 'block',
									}}
								>
									<div
										className='singlepost-social-action singlepost-social-action-twitter'
										onClick={this.handleShareOnTwitter}
									>
										<span className='singlepost-social-twitter-logo'>
											<FontAwesomeIcon icon={faTwitter} color='#2F2F3C' />
										</span>
										<span className='singlepost-social-twitter-text'>
											Twitter
										</span>
									</div>
									<div
										className='singlepost-social-action singlepost-social-action-facebook'
										onClick={this.handleShareOnFacebook}
									>
										<span className='singlepost-social-facebook-logo'>
											<FontAwesomeIcon icon={faFacebookF} color='#2F2F3C' />
										</span>
										<span className='singlepost-social-facebook-text'>
											Facebook
										</span>
									</div>
								</span>
							</span>
						</div>
					</div>
					<div className='singlepost-info-wrapper'>
						<div className='singlepost-user-wrapper'>
							<Link to={{ pathname: '/profile/' + postOwner.user_id }}>
								<span className='singlepost-username'>
									{postOwner.user_name}
								</span>
							</Link>
							{!isPostEditable && (
								<span
									className='singlepost-sendmessage'
									data-userid={postOwner.user_id}
									onClick={this.handleSendMessage}
								>
									<FontAwesomeIcon
										icon={faEnvelope}
										color='#2F2F3C'
										size='xs'
									/>
								</span>
							)}
						</div>
						<span className='singlepost-date-wrapper'>
							<Link to={{ pathname: '/post/' + post.post_id }}>
								<span className='singlepost-postdate'>
									{postDatePrettyText}
								</span>
								{
									editDate && (
										// <div className="singlepost-editdate">
										<span className='singlepost-editdate'>
											&nbsp;~ {editDatePrettyText}
										</span>
									)
									// </div>
								}
							</Link>
						</span>
						{isPostEditable && (
							<span className='singlepost-actions-wrapper'>
								<span
									className='singlepost-actions-button'
									onClick={this.toggleEditDeletePost}
								>
									<FontAwesomeIcon
										icon={faCaretDown}
										color='#2F2F3C'
										size='lg'
									/>
								</span>
								<div
									className='singlepost-actions-dropdown'
									id='singlepost-actions-dropdown'
									style={{
										display: this.state.isPostActionsDropdownHidden
											? 'none'
											: 'inline-block',
									}}
								>
									<div
										className='singlepost-actions-action singlepost-actions-edit'
										onClick={this.handleEditPost}
									>
										Düzenle
									</div>
									<div
										className='singlepost-actions-action singlepost-actions-delete'
										onClick={this.handleDeletePost}
									>
										Sil
									</div>
								</div>
							</span>
						)}
						{!isPostEditable && (
							<span className='singlepost-report' onClick={this.handleReport}>
								<FontAwesomeIcon
									icon={faExclamation}
									color='#2F2F3C'
									size='xs'
								/>
							</span>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(connect(mapStateToProps)(SinglePost));
