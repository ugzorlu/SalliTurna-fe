import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
// import AdSense from 'react-adsense'
import { Image } from 'cloudinary-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleUp,
	faAngleDown,
	faShareAlt,
	faMapMarkedAlt,
	faCalendarAlt,
	faClock,
} from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');

import SinglePost from '../components/SinglePost.js';
import { API_DIRECTORY } from '../utils/constants.js';
import { getCookie, getCityName } from '../utils/commons.js';
import { setCity } from '../actions/cityActions.js';
import '../styles/App.scss';
import '../styles/Home.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
		City: state.city,
	};
};

class EventCard extends Component {
	constructor(props) {
		super(props);
	}

	handleOpenPhotoInModal = (e) => {
		const postPhoto = e.currentTarget.dataset.postphoto;
		this.props.updateModal(false, postPhoto);
	};

	render() {
		const topic = this.props.topic,
			post = topic.Posts[0];

		let topicInfoArea = null,
			topicAttendanceArea = null,
			topicPhotoArea = null,
			topicSourceLinkArea = null,
			adsenseArea = null;

		// if (this.props.index % 5 === 3) {
		// 	adsenseArea = (
		// 		<div className='rekl-container'>
		// 			<AdSense.Google
		// 				className='adsbygoogle'
		// 				client='ca-pub-5093736351800898'
		// 				slot='5013158262'
		// 				layout='in-article'
		// 				format='fluid'
		// 			/>
		// 		</div>
		// 	);
		// }

		let topicInfoVenueArea = null;
		if (topic.Venue) {
			topicInfoVenueArea = (
				<Link to={{ pathname: '/venue/' + topic.Venue.venue_id }}>
					<span className='topic-venue-wrapper'>
						<span className='topic-venue-icon'>
							<FontAwesomeIcon icon={faMapMarkedAlt} color='#2F2F3C' />
						</span>
						<span className='topic-venue'>{topic.Venue.venue_title}</span>
					</span>
				</Link>
			);
		}

		let topicInfoDateArea = null;
		if (topic.start_date) {
			let topicDateFormat =
				moment(topic.start_date).format('Do MMMM YYYY dddd') + ' ';
			if (topic.end_date) {
				topicDateFormat =
					moment(topic.start_date).format('Do') +
					'-' +
					moment(topic.end_date).format('Do MMMM YYYY') +
					' ';
			}
			topicInfoDateArea = (
				<span className='topic-time-wrapper'>
					<span className='topic-date-wrapper'>
						<span className='topic-date-icon'>
							<FontAwesomeIcon icon={faCalendarAlt} color='#2F2F3C' />
						</span>
						<span className='topic-date'>{topicDateFormat}</span>
					</span>
					<span className='topic-clock-wrapper'>
						<span className='topic-clock-icon'>
							<FontAwesomeIcon icon={faClock} color='#2F2F3C' />
						</span>
						<span className='topic-clock'>
							{moment(topic.start_date).format('HH:mm')}
						</span>
					</span>
				</span>
			);
		}

		topicInfoArea = (
			<div className='topic-info-container'>
				{topicInfoVenueArea}
				{topicInfoDateArea}
			</div>
		);

		if (post.totalAttendance > 0) {
			topicAttendanceArea = (
				<div className='topic-topbar-container home-upcomingevent-topic-topbar-topicinfo-container'>
					<div className='home-upcomingevent-topic-topbar home-upcomingevent-topic-topbar-topicinfo'>
						<div className='home-upcomingevent-topic-attendance-container'>
							<div className='home-upcomingevent-topic-attendance-count'>
								{post.totalAttendance}
							</div>
							<div className='home-upcomingevent-topic-attendance-count-text'>
								&nbsp;Şallı Turna kullanıcısı katılacak
							</div>
						</div>
					</div>
				</div>
			);
		}

		if (post.post_photo) {
			topicPhotoArea = (
				<div
					className='home-photo-wrapper'
					data-postphoto={post.post_photo}
					onClick={this.handleOpenPhotoInModal}
				>
					<Image
						cloudName='di6klblik'
						publicId={post.post_photo}
						width='100%'
					/>
				</div>
			);
		}

		if (topic.source_link !== null) {
			topicSourceLinkArea = (
				<a href={topic.source_link} target='_blank' rel='noreferrer'>
					<div className='topic-source-link'>
						<div className='topic-source-link-text'>
							{topic.City.city_id === 82 && topic.isFree
								? 'Yayına Git'
								: 'Bilgi Al'}
						</div>
					</div>
				</a>
			);
		}
		return (
			<div className='home-upcomingevents-event-container'>
				{adsenseArea}
				<Link to={{ pathname: '/topic/' + topic.topic_id }}>
					<div className='topic-title-container'>
						<div className='topic-title-wrapper'>
							<div className='topic-title'>{topic.topic_title}</div>
							{topicInfoArea}
						</div>
					</div>
					{topicAttendanceArea}
					{topicPhotoArea}
					{topicSourceLinkArea}
				</Link>
			</div>
		);
	}
}

class TopicCard extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const post = this.props.post,
			topic = post.Topic;

		let adsenseArea = null;

		// if (this.props.index % 5 === 3) {
		// 	adsenseArea = (
		// 		<div className='rekl-container'>
		// 			<AdSense.Google
		// 				className='adsbygoogle'
		// 				client='ca-pub-5093736351800898'
		// 				slot='5013158262'
		// 				layout='in-article'
		// 				format='fluid'
		// 			/>
		// 		</div>
		// 	);
		// }

		return (
			<div className='home-bestposts-topic-container'>
				{adsenseArea}
				<Link to={{ pathname: '/topic/' + topic.topic_id }}>
					<div className='topic-title-container'>
						<div className='topic-title-wrapper'>
							<div className='topic-title'>
								{topic.topic_title} ({topic.Category.category_name})
							</div>
						</div>
					</div>
				</Link>
				<SinglePost
					Post={post}
					getPosts={this.props.getPosts}
					updateModal={this.props.updateModal}
					openDialog={this.props.openDialog}
				/>
			</div>
		);
	}
}

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: {
				downloading: true,
				UpcomingEvents: [],
				pagination: {
					current_page: 1,
					total_page: 1,
				},
			},
			posts: {
				downloading: true,
				BestPosts: [],
				pagination: {
					current_page: 1,
					total_page: 1,
				},
			},
		};
	}

	componentDidMount() {
		const city_id = getCookie('city');
		if (city_id) {
			const currentCity = { id: city_id, name: getCityName(city_id) };
			this.props.setCity(currentCity);
		}
		if (this.props.User.id !== null) {
			this.getUpcomingEvents();
			this.getBestPosts();
		}
		this.props.updateLeftFrame(true);
		window.scrollTo(0, 0);
	}

	componentDidUpdate(prevProps) {
		if (
			this.props.location !== prevProps.location ||
			this.props.User !== prevProps.User ||
			this.props.City !== prevProps.City
		) {
			this.getUpcomingEvents(this.state.events.pagination.current_page);
			this.getBestPosts(this.state.posts.pagination.current_page);
			window.scrollTo(0, 0);
		}
	}

	handleRedirectToEvents = () => {
		this.props.updateLeftFrame(false, true);
	};

	handleRedirectToTopics = () => {
		this.props.updateLeftFrame(false, false);
	};

	getUpcomingEvents = async (targetpagenumber) => {
		this.setState((prevState) => ({
			...prevState,
			events: {
				...prevState.events,
				downloading: true,
			},
		}));
		const res = await fetch(API_DIRECTORY + '/getUpcomingEvents', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				city_id: this.props.City.id,
				targetpagenumber: targetpagenumber ? targetpagenumber : 1,
			}),
			credentials: 'include',
		});
		const responseUpcomingEvents = await res.json();
		if (responseUpcomingEvents.status === 'success') {
			this.setState((prevState) => ({
				...prevState,
				events: {
					...prevState.events,
					UpcomingEvents:
						prevState.events.UpcomingEvents &&
						JSON.stringify(prevState.events.UpcomingEvents) !=
							JSON.stringify(responseUpcomingEvents.UpcomingEvents)
							? prevState.events.UpcomingEvents.concat(
									responseUpcomingEvents.UpcomingEvents
							  )
							: responseUpcomingEvents.UpcomingEvents,
				},
			}));
			if (responseUpcomingEvents.totaleventcount > 5)
				this.setState((prevState) => ({
					...prevState,
					events: {
						...prevState.events,
						pagination: {
							...prevState.events.pagination,
							total_page: Math.ceil(responseUpcomingEvents.totaleventcount / 5),
						},
					},
				}));
			this.setState((prevState) => ({
				...prevState,
				events: {
					...prevState.events,
					downloading: false,
				},
			}));
		}
	};

	handleShowMoreEvents = () => {
		this.getUpcomingEvents(this.state.events.pagination.current_page + 1);
		this.setState((prevState) => ({
			...prevState,
			events: {
				...prevState.events,
				pagination: {
					...prevState.events.pagination,
					current_page: prevState.events.pagination.current_page + 1,
				},
			},
		}));
	};

	getBestPosts = async (targetpagenumber) => {
		this.setState((prevState) => ({
			...prevState,
			posts: {
				...prevState.posts,
				downloading: true,
			},
		}));
		const res = await fetch(API_DIRECTORY + '/getBestPosts', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				targetpagenumber: targetpagenumber ? targetpagenumber : 1,
			}),
			credentials: 'include',
		});
		const responseBestPosts = await res.json();
		if (responseBestPosts.status === 'success') {
			this.setState((prevState) => ({
				...prevState,
				posts: {
					...prevState.posts,
					BestPosts:
						prevState.posts.BestPosts &&
						JSON.stringify(prevState.posts.BestPosts) !=
							JSON.stringify(responseBestPosts.BestPosts)
							? prevState.posts.BestPosts.concat(responseBestPosts.BestPosts)
							: responseBestPosts.BestPosts,
				},
			}));
			if (responseBestPosts.totalpostcount > 5)
				this.setState((prevState) => ({
					...prevState,
					posts: {
						...prevState.posts,
						pagination: {
							...prevState.posts.pagination,
							total_page: Math.ceil(responseBestPosts.totalpostcount / 5),
						},
					},
				}));
		}
		this.setState((prevState) => ({
			...prevState,
			posts: {
				...prevState.posts,
				downloading: false,
			},
		}));
	};

	handleShowMorePosts = () => {
		this.getBestPosts(this.state.posts.pagination.current_page + 1);
		this.setState((prevState) => ({
			...prevState,
			posts: {
				...prevState.posts,
				pagination: {
					...prevState.posts.pagination,
					current_page: prevState.posts.pagination.current_page + 1,
				},
			},
		}));
	};

	render() {
		const welcomeMsgArea = (
			<div className='home-welcomemsg'>
				<h1 className='home-welcomemsg-text home-welcomemsg-text-left'>
					Kültür-sanat etkinliklerini
					<br></br>ve konularını incele.
				</h1>
				<h1 className='home-welcomemsg-text home-welcomemsg-text-right'>
					Kaydol ve
					<br></br>hatırlatmaları al.
					<br></br>Etkinlikleri kaçırma!
				</h1>
				<div className='home-redirect-topics-bottom'>
					<div className='home-redirect-topics-button-wrapper'>
						<input
							id='home-redirect-topics-button'
							className='home-redirect-topics-button'
							type='button'
							value='Etkinliklere Göz At'
							onClick={this.handleRedirectToEvents}
						/>
					</div>
					<div className='home-redirect-museums-button-wrapper'>
						<input
							id='home-redirect-museums-button'
							className='home-redirect-museums-button'
							type='button'
							value='Konulara Göz At'
							onClick={this.handleRedirectToTopics}
						/>
					</div>
				</div>
			</div>
		);

		const UpcomingEvents = this.state.events.UpcomingEvents;
		const upcomingEvents = (
			<>
				{UpcomingEvents != null &&
					UpcomingEvents.length !== 0 &&
					UpcomingEvents.map((Event, index) => {
						return (
							<EventCard
								key={'home-upcomingevent-topicid-' + Event.topic_id}
								index={index}
								topic={Event}
								updateModal={this.props.updateModal}
							/>
						);
					})}
			</>
		);

		let showMoreEventsButtonArea = null;
		if (
			this.state.events.pagination.current_page !==
			this.state.events.pagination.total_page
		) {
			showMoreEventsButtonArea = (
				<div className='home-upcomingevents-showmore-button-wrapper'>
					<input
						id='home-upcomingevents-showmore-button'
						className='home-upcomingevents-showmore-button'
						type='button'
						value='Daha Fazla Etkinlik Göster'
						onClick={this.handleShowMoreEvents}
					/>
				</div>
			);
		}

		const upcomingEventsArea = this.state.events.downloading ? (
			<div
				id='home-upcomingevents-wrapper'
				className='home-upcomingevents-wrapper'
			>
				<div className='home-upcomingevents-title-wrapper'>
					<div className='home-upcomingevents-title'>YAKLAŞAN ETKİNLİKLER</div>
				</div>
				<div className='home-upcomingevents-events-container'>
					{upcomingEvents}
					{[...Array(5)].map((x, i) => (
						<div
							className='home-upcomingevents-event-container'
							key={'home-upcomingevents-event-container' + i}
						>
							<div className='topic-title-container'>
								<div className='topic-title-wrapper'>
									<div className='topic-title topic-title-skeleton'></div>
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
					))}
				</div>
			</div>
		) : (
			<div
				id='home-upcomingevents-wrapper'
				className='home-upcomingevents-wrapper'
			>
				<div className='home-upcomingevents-title-wrapper'>
					<div className='home-upcomingevents-title'>YAKLAŞAN ETKİNLİKLER</div>
				</div>
				<div className='home-upcomingevents-events-container'>
					{upcomingEvents}
				</div>
				{showMoreEventsButtonArea}
			</div>
		);

		let showMoreTopicsButtonArea = null;
		if (
			this.state.posts.pagination.current_page !==
			this.state.posts.pagination.total_page
		) {
			showMoreTopicsButtonArea = (
				<div className='home-bestposts-showmore-button-wrapper'>
					<input
						id='home-bestposts-showmore-button'
						className='home-bestposts-showmore-button'
						type='button'
						value='Daha Fazla Gönderi Göster'
						onClick={this.handleShowMorePosts}
					/>
				</div>
			);
		}

		const BestPosts = this.state.posts.BestPosts;
		const bestPosts = (
			<>
				{BestPosts != null &&
					BestPosts.length !== 0 &&
					BestPosts.map((Post, index) => {
						return (
							<TopicCard
								key={'home-bestposts-topicid-' + Post.topic_id}
								index={index}
								post={Post}
								getPosts={this.props.getPosts}
								updateModal={this.props.updateModal}
								openDialog={this.props.openDialog}
							/>
						);
					})}
				{showMoreTopicsButtonArea}
			</>
		);
		const bestPostsArea = this.state.posts.downloading ? (
			<div className='home-bestposts-wrapper'>
				<div className='home-bestposts-title-wrapper'>
					<div className='home-bestposts-title'>AYIN EN İYİ GÖNDERİLERİ</div>
				</div>
				<div className='home-bestposts-topics-container'>
					{bestPosts}
					{[...Array(5)].map((x, i) => (
						<div
							className='home-bestposts-topic-container'
							key={'home-bestposts-topic-container' + i}
						>
							<div className='topic-title-container'>
								<div className='topic-title-wrapper'>
									<div className='topic-title topic-title-skeleton'></div>
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
					))}
				</div>
			</div>
		) : (
			<div className='home-bestposts-wrapper'>
				<div className='home-bestposts-title-wrapper'>
					<div className='home-bestposts-title'>AYIN EN İYİ GÖNDERİLERİ</div>
				</div>
				<div className='home-bestposts-topics-container'>{bestPosts}</div>
			</div>
		);

		return (
			<>
				<Helmet>
					<meta
						name='description'
						content='Etrafındaki etkinliklerden anında haberdar olmanı sağlayan interaktif kültür-sanat portalı. İstanbul etkinlikleri, İzmir etkinlikleri, Ankara etkinlikleri, online etkinlikler ve her türlü kültür sanat konusu hakkında paylaşımları bulabilirsin. Kayıt olup etkinlikleri takip edebilir, ilan verebilir ve paylaşımda bulunabilirsin.'
						data-react-helmet='true'
					/>
				</Helmet>
				<div className='home-container'>
					{welcomeMsgArea}
					<div className='home-cards-wrapper'>
						{upcomingEventsArea}
						{bestPostsArea}
					</div>
				</div>
			</>
		);
	}
}

export default connect(mapStateToProps, { setCity })(Home);
