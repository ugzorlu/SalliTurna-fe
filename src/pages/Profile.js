import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Helmet } from 'react-helmet';
import { Image, Transformation } from 'cloudinary-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCaretDown,
	faAngleUp,
	faAngleDown,
	faShareAlt,
} from '@fortawesome/free-solid-svg-icons';

import SinglePost from '../components/SinglePost';
import '../styles/App.scss';
import '../styles/Profile.scss';
import '../styles/Topic.scss';
import { API_DIRECTORY } from '../utils/constants';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userdownloading: true,
			postsdownloading: true,
			pagination: {
				current_page: 1,
				total_page: 1,
			},
			selectcriteria: 'own',
		};
	}

	getLatestPostsOfUser = async (userid, targetpagenumber) => {
		const user_id = userid ? userid : this.props.match.params.userid;

		this.setState({ postsdownloading: true });
		const res = await fetch(API_DIRECTORY + '/getLatestPostsOfUser', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				user_id: user_id,
				targetpagenumber: targetpagenumber ? targetpagenumber : 1,
			}),
			credentials: 'include',
		});
		const responseLatestPosts = await res.json();
		if (responseLatestPosts.status === 'success') {
			this.setState({
				Profile: {
					...this.state.Profile,
					Posts: {
						...this.state.Profile.Posts,
						LatestPosts:
							null != this.state.Profile && this.state.Profile.Posts.LatestPosts
								? this.state.Profile.Posts.LatestPosts.concat(
										responseLatestPosts.Posts.LatestPosts
								  )
								: responseLatestPosts.Posts.LatestPosts,
					},
				},
			});

			if (responseLatestPosts.Posts.totalpostcount > 10)
				this.setState({
					pagination: {
						...this.state.pagination,
						total_page: Math.ceil(
							responseLatestPosts.Posts.totalpostcount / 10
						),
					},
				});
		} else {
			this.props.openDialog(
				responseLatestPosts.status,
				responseLatestPosts.message
			);
		}
		this.setState({ postsdownloading: false });
	};

	getLatestVotedPostsOfUser = async (userid, targetpagenumber, isUpvote) => {
		const user_id = userid ? userid : this.props.match.params.userid;
		this.setState({ postsdownloading: true });
		const res = await fetch(API_DIRECTORY + '/getLatestVotedPostsOfUser', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				user_id: user_id,
				targetpagenumber: targetpagenumber ? targetpagenumber : 1,
				isUpvote: isUpvote,
			}),
			credentials: 'include',
		});
		const responseLatestPosts = await res.json();
		if (responseLatestPosts.status === 'success') {
			this.setState({
				Profile: {
					...this.state.Profile,
					Posts: {
						...this.state.Profile.Posts,
						LatestPosts: this.state.Profile.Posts.LatestPosts
							? this.state.Profile.Posts.LatestPosts.concat(
									responseLatestPosts.Posts.LatestPosts
							  )
							: responseLatestPosts.Posts.LatestPosts,
					},
				},
			});

			if (responseLatestPosts.Posts.totalpostcount > 10)
				this.setState({
					pagination: {
						...this.state.pagination,
						total_page: Math.ceil(
							responseLatestPosts.Posts.totalpostcount / 10
						),
					},
				});
		} else {
			this.props.openDialog(
				responseLatestPosts.status,
				responseLatestPosts.message
			);
		}
		this.setState({ postsdownloading: false });
	};

	getLatestAttendenceEventsOfUser = async (userid, targetpagenumber) => {
		const user_id = userid ? userid : this.props.match.params.userid;

		this.setState({ postsdownloading: true });
		const res = await fetch(
			API_DIRECTORY + '/getLatestAttendenceEventsOfUser',
			{
				method: 'post',
				headers: {
					'content-type': 'application/json; charset=UTF-8',
				},
				body: JSON.stringify({
					user_id: user_id,
					targetpagenumber: targetpagenumber ? targetpagenumber : 1,
				}),
				credentials: 'include',
			}
		);
		const responseLatestAttendenceEventsOfUser = await res.json();
		if (responseLatestAttendenceEventsOfUser.status === 'success') {
			this.setState({
				Profile: {
					...this.state.Profile,
					Posts: {
						...this.state.Profile.Posts,
						LatestPosts: this.state.Profile.Posts.LatestPosts
							? this.state.Profile.Posts.LatestPosts.concat(
									responseLatestAttendenceEventsOfUser.Posts.LatestPosts
							  )
							: responseLatestAttendenceEventsOfUser.Posts.LatestPosts,
					},
				},
			});

			if (responseLatestAttendenceEventsOfUser.Posts.totalpostcount > 10)
				this.setState({
					pagination: {
						...this.state.pagination,
						total_page: Math.ceil(
							responseLatestAttendenceEventsOfUser.Posts.totalpostcount / 10
						),
					},
				});
		}
		//   this.setState({
		//     Profile: {
		//       ...this.state.Profile,
		//       LatestAttendanceEvents: this.state.Profile.LatestAttendanceEvents ? this.state.Profile.LatestAttendanceEvents.concat(responseLatestAttendenceEventsOfUser.Posts.LatestPosts) : responseLatestAttendenceEventsOfUser.Posts.LatestPosts
		//     }
		//   })
		//
		//   if(responseLatestAttendenceEventsOfUser.Posts.totalpostcount > 10)(
		//     this.setState({
		//       pagination:
		//       {
		//         ...this.state.pagination,
		//         total_page: Math.ceil(responseLatestAttendenceEventsOfUser.Posts.LatestPosts.totalpostcount / 10)
		//       }
		//     })
		//   )
		// }
		else {
			this.props.openDialog(
				responseLatestAttendenceEventsOfUser.status,
				responseLatestAttendenceEventsOfUser.message
			);
		}
		this.setState({ postsdownloading: false });
	};

	getProfile = async (userid, targetpagenumber) => {
		this.setState({ userdownloading: true });
		const user_id = userid ? userid : this.props.match.params.userid;

		const res = await fetch(API_DIRECTORY + '/getProfile/' + user_id, {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				targetpagenumber: targetpagenumber ? targetpagenumber : 1,
			}),
			credentials: 'include',
		});
		const responseProfile = await res.json();
		if (responseProfile.status === 'success') {
			this.setState({ Profile: responseProfile.Profile });

			// if(responseProfile.Profile.Posts.totalpostcount > 10)(
			//   this.setState({
			//     pagination:
			//     {
			//       ...this.state.pagination,
			//       total_page: Math.ceil(responseProfile.Profile.Posts.totalpostcount / 10)
			//     }
			//   })
			// )
			this.getLatestPostsOfUser(null, 1);
			if (this.props.User.id == responseProfile.Profile.User.user_id) {
				this.getFollowedHashtags();
				this.getReminderEvents();
			}
		} else {
			this.props.openDialog(responseProfile.status, responseProfile.message);
		}
		this.setState({ userdownloading: false });
	};

	getFollowedHashtags = async () => {
		const res = await fetch(API_DIRECTORY + '/getFollowedHashtags', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({}),
			credentials: 'include',
		});
		const responseFollowedHashtags = await res.json();
		if (responseFollowedHashtags.status === 'success') {
			this.setState({
				FollowedHashtags: responseFollowedHashtags.FollowedHashtags,
			});
		}
	};

	getReminderEvents = async () => {
		const res = await fetch(API_DIRECTORY + '/getReminderEvents', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({}),
			credentials: 'include',
		});
		const responseReminderEvents = await res.json();
		if (responseReminderEvents.status === 'success') {
			this.setState({ ReminderEvents: responseReminderEvents.ReminderEvents });
		}
	};

	componentDidMount() {
		if (this.props.User.id !== null) {
			this.getProfile();
		}
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.props.location !== prevProps.location ||
			this.props.User !== prevProps.User
		) {
			this.resetPagination();
			this.getProfile();
			window.scrollTo(0, 0);
		}
	}

	resetPagination = () => {
		this.setState({
			pagination: {
				current_page: 1,
				total_page: 1,
			},
		});
	};

	uploadPhoto = () => {
		this.setState({ userdownloading: true });
		let profileform = document.getElementById('profile-form');
		let form_data = new FormData(profileform);
		fetch(API_DIRECTORY + '/changeProfilePhoto', {
			method: 'post',
			body: form_data,
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseChangeProfilePhoto) => {
				if (responseChangeProfilePhoto.status === 'success') {
					this.getProfile();
					this.props.openDialog(
						responseChangeProfilePhoto.status,
						responseChangeProfilePhoto.message
					);
				} else {
					this.props.openDialog(
						responseChangeProfilePhoto.status,
						responseChangeProfilePhoto.message
					);
				}
				this.setState({ userdownloading: false });
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	handleAddPhoto = () => {
		document.getElementById('profile-addphoto').click();
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

		let input = document.querySelector('.profile-addphoto');
		let curFiles = input.files;
		if (curFiles.length === 0) {
			this.props.openDialog('error', 'Seçili fotoğraf yok.');
		} else {
			for (let i = 0; i < curFiles.length; i++) {
				if (validFileType(curFiles[i])) {
					if (curFiles[i].size > 10 * 1048576) {
						this.props.openDialog(
							'error',
							"Seçili fotoğrafın boyutu 10 MB'ı aşamaz."
						);
						return;
					}
					this.uploadPhoto();
				} else {
					this.props.openDialog(
						'error',
						curFiles[i].name +
							': Geçerli dosya tipi değil. Lütfen seçiminizi değiştirin.'
					);
				}
			}
		}
	};

	handleOpenPhotoInModal = () => {
		this.props.updateModal(false, this.state.Profile.User.user_photo);
	};

	handleShowMorePosts = () => {
		if (this.state.selectcriteria === 'own') {
			this.getLatestPostsOfUser(null, this.state.pagination.current_page + 1);
		} else if (this.state.selectcriteria === 'upvoted') {
			this.getLatestVotedPostsOfUser(
				null,
				this.state.pagination.current_page + 1,
				1
			);
		} else if (this.state.selectcriteria === 'downvoted') {
			this.getLatestVotedPostsOfUser(
				null,
				this.state.pagination.current_page + 1,
				0
			);
		}
		this.setState({
			pagination: {
				...this.state.pagination,
				current_page: this.state.pagination.current_page + 1,
			},
		});
	};

	handleSelectPostsCriteria = async (e) => {
		const criteria = e.currentTarget.value;
		this.resetPagination();
		this.setState({
			selectcriteria: criteria,
			Profile: {
				...this.state.Profile,
				Posts: {},
			},
		});
		if (criteria === 'own') {
			this.getLatestPostsOfUser(null, 1);
		} else if (criteria === 'upvoted') {
			this.getLatestVotedPostsOfUser(null, 1, 1);
		} else if (criteria === 'downvoted') {
			this.getLatestVotedPostsOfUser(null, 1, 0);
		} else if (criteria === 'attendance') {
			this.getLatestAttendenceEventsOfUser(null, 1, 0);
		}
	};

	handleClickHashtag = async (e) => {
		let selectedHashtag = e.currentTarget;
		let hashtagid = e.currentTarget.dataset.hashtagid;

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
		this.getFollowedHashtags();
		this.getReminderEvents();
	};

	handleClickReminder = async (e) => {
		let selectedReminder = e.currentTarget;
		let eventid = e.currentTarget.dataset.eventid;

		const res = await fetch(API_DIRECTORY + '/declareEventAttendance', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				topic_id: eventid,
			}),
			credentials: 'include',
		});
		const responseDeclareAttendance = await res.json();
		this.props.openDialog(
			responseDeclareAttendance.status,
			responseDeclareAttendance.message
		);
		this.getFollowedHashtags();
		this.getReminderEvents();
	};

	render() {
		const userid = this.props.match.params.userid;
		const User = this.props.User;
		const Profile = this.state.Profile;
		if (Profile == null || !Object.keys(Profile).length || userid == null) {
			return null;
		}

		// const Profile = responseProfile.Profile

		const userArea = this.state.userdownloading ? (
			<div className='profile-user-container'>
				<div className='profile-photo-skeleton'></div>
				<div className='profile-username-skeleton'></div>
				<div className='profile-latestposts-title'>Son gönderileri</div>
			</div>
		) : (
			<div className='profile-user-container'>
				<div className='profile-photo' onClick={this.handleOpenPhotoInModal}>
					{Profile.User.user_photo && (
						<Image
							cloudName='di6klblik'
							publicId={Profile.User.user_photo}
							width='100%'
						>
							<Transformation
								crop='fill'
								height='80'
								width='80'
								radius='max'
								background='#E6E2E3'
							/>
						</Image>
					)}
				</div>
				<div className='profile-username'>{Profile.User.user_name}</div>
				{User.id == Profile.User.user_id && (
					<>
						<div className='profile-btn-addphoto-container'>
							<div
								className='profile-btn-addphoto'
								onClick={this.handleAddPhoto}
							>
								Fotoğrafı Değiştir
							</div>
							<form className='profile-form' id='profile-form'>
								<input
									type='file'
									id='profile-addphoto'
									className='profile-addphoto'
									name='profile_photo'
									onChange={this.handleSelectPhoto}
									accept='image/*'
								/>
							</form>
						</div>
						<div className='profile-followedhashtags-container'>
							{this.state.FollowedHashtags != null &&
								(this.state.FollowedHashtags.length === 0 ? (
									<>
										<div className='profile-followedhashtag-text'>
											Takip ettiğin etiket yok.
										</div>
										<div className='profile-followedhashtag-text'>
											Etkinlik sayfalarından etiketleri takip edebilirsin.
										</div>
									</>
								) : (
									<>
										<div className='profile-followedhashtag-text'>
											Takip ettiklerin:
										</div>
										{this.state.FollowedHashtags.map((FollowedHashtag) => (
											<div
												className='profile-followedhashtag'
												key={'hashtag' + FollowedHashtag.hashtag_id}
												data-hashtagid={FollowedHashtag.hashtag_id}
												onClick={this.handleClickHashtag}
											>
												{FollowedHashtag.Hashtag.hashtag_name}
											</div>
										))}
										<div className='profile-followedhashtag-text'>
											(Etikete tıklayıp takibi bırakabilirsin.)
										</div>
									</>
								))}
						</div>
						<div className='profile-reminderevents-container'>
							{this.state.ReminderEvents != null &&
								(this.state.ReminderEvents.length === 0 ? (
									<>
										<div className='profile-reminderevents-text'>
											İstediğin hatırlatma yok.
										</div>
										<div className='profile-reminderevents-text'>
											Etkinlik sayfalarından hatırlatma isteyebilirsin.
										</div>
									</>
								) : (
									<>
										<div className='profile-reminderevents-text'>
											Hatırlatma istediklerin:
										</div>
										{this.state.ReminderEvents.map((ReminderEvent) => (
											<div
												className='profile-reminderevents'
												key={'reminder' + ReminderEvent.event_id}
												data-eventid={ReminderEvent.event_id}
												onClick={this.handleClickReminder}
											>
												{ReminderEvent.Topic.topic_title}
											</div>
										))}
										<div className='profile-reminderevents-text'>
											(Etikete tıklayıp hatırlatmayı kaldırabilirsin.)
										</div>
									</>
								))}
						</div>
					</>
				)}
				<div className='profile-selectcriteria-container'>
					<select
						className='profile-selectcriteria-dropdown'
						onChange={this.handleSelectPostsCriteria}
					>
						<option value='own'>Son gönderileri</option>
						<option value='upvoted'>Son iyi oyladıkları</option>
						<option value='downvoted'>Son kötü oyladıkları</option>
						<option value='attendance'>Katıldığı etkinlikler</option>
					</select>
					<span className='profile-selectcriteria-icon'>
						<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
					</span>
				</div>
			</div>
		);

		const posts = (
			<div className='profile-latestposts-posts'>
				{Profile.Posts.LatestPosts != null &&
					Profile.Posts.LatestPosts.map((Post) => {
						return (
							<div key={'post-id-' + Post.post_id}>
								<Link to={{ pathname: '/topic/' + Post.Topic.topic_id }}>
									<div className='topic-title-container'>
										<div className='topic-title-wrapper'>
											{Post.Topic.Category.isEvent === 0 ? (
												<h1 className='topic-title'>
													{Post.Topic.topic_title} (
													{Post.Topic.Category.category_name})
												</h1>
											) : (
												<h1 className='topic-title'>
													{Post.Topic.topic_title}
												</h1>
											)}
										</div>
									</div>
								</Link>
								<SinglePost
									Post={Post}
									getProfile={this.getProfile}
									updateModal={this.props.updateModal}
									openDialog={this.props.openDialog}
								/>
							</div>
						);
					})}
			</div>
		);

		const postsArea = this.state.postsdownloading ? (
			<div className='profile-posts-container'>
				<div className='profile-postarea'>
					{posts}
					{[...Array(3)].map((x, i) => (
						<div className='profile-posts-skeleton-container' key={i}>
							<div className='topic-title-container'>
								<div className='topic-title-wrapper'>
									<h1 className='topic-title-skeleton'></h1>
								</div>
							</div>
							<div className='profile-singlepost-container'>
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
					))}
				</div>
			</div>
		) : (
			<div className='profile-posts-container'>
				<div
					className='profile-postarea'
					style={{
						display:
							Array.isArray(Profile.Posts.LatestPosts) &&
							Profile.Posts.LatestPosts.length
								? 'block'
								: 'none',
					}}
				>
					{posts}
					<div className='profile-posts-button-showmore-container'>
						<input
							className='profile-posts-button-showmore'
							type='button'
							value='Daha fazla göster'
							onClick={this.handleShowMorePosts}
							style={{
								display:
									this.state.pagination.current_page ===
									this.state.pagination.total_page
										? 'none'
										: 'block',
							}}
						/>
					</div>
				</div>
				<div className='profile-posts-notfound-container'>
					<span
						className='profile-posts-notfound'
						style={{
							display:
								Profile.Posts == null ||
								Profile.Posts.LatestPosts == null ||
								!Profile.Posts.LatestPosts.length
									? 'block'
									: 'none',
						}}
					>
						Aradığınız kriterlere uygun sonuç bulunamadı.
					</span>
				</div>
			</div>
		);

		return (
			<>
				<Helmet>
					<title>{Profile.User.user_name} | Şallı Turna</title>
				</Helmet>
				<div className='profile-container'>
					{userArea}
					{postsArea}
				</div>
			</>
		);
	}
}

export default connect(mapStateToProps)(Profile);
