import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
// import AdSense from 'react-adsense'
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr';
registerLocale('tr', tr);
setDefaultLocale('tr');
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import { Image, Transformation } from 'cloudinary-react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faAngleDoubleRight,
	faCaretDown,
	faCalendarAlt,
	faMapMarkerAlt,
	faEye,
} from '@fortawesome/free-solid-svg-icons';

import { API_DIRECTORY } from '../utils/constants.js';

import { setCookie, getCityName } from '../utils/commons.js';
import { setCity } from '../actions/cityActions.js';
import '../styles/App.scss';
import '../styles/LeftFrame.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
		City: state.city,
	};
};

class EmbeddedTitleList extends Component {
	constructor(props) {
		super(props);
		this.state = { selectedTopic: null };
	}

	handleSelectTopic = (e) => {
		const clickedTopicName = e.currentTarget.dataset.topicname;
		this.setState((prevState) => ({
			...prevState,
			selectedTopic: clickedTopicName,
		}));
	};

	render() {
		const url = this.props.location.pathname;
		let leftframeTopicWrapperMuseumClasses = classNames(
			'leftframe-topic-wrapper',
			{
				'leftframe-topic-wrapper-active':
					'museumlist' == this.state.selectedTopic &&
					url.includes('onlinemuzeler'),
			}
		);
		let leftframeTopicWrapperMovieClasses = classNames(
			'leftframe-topic-wrapper',
			{
				'leftframe-topic-wrapper-active':
					'movielist' == this.state.selectedTopic &&
					url.includes('kendini-iyi-hisset-filmleri'),
			}
		);
		return (
			<div className='leftframe-topiclist'>
				<div
					className={leftframeTopicWrapperMuseumClasses}
					onClick={this.handleSelectTopic}
					data-topicname='museumlist'
				>
					<Link to={{ pathname: '/onlinemuzeler' }}>
						<div className='leftframe-topic-container'>
							<div className='leftframe-topic'>
								<div className='leftframe-topic-title'>Sanal Müzeler</div>
								<span className='leftframe-topic-postcount'>10</span>
							</div>
						</div>
					</Link>
				</div>
				<div
					className={leftframeTopicWrapperMovieClasses}
					onClick={this.handleSelectTopic}
					data-topicname='movielist'
				>
					<Link to={{ pathname: '/kendini-iyi-hisset-filmleri' }}>
						<div className='leftframe-topic-container'>
							<div className='leftframe-topic'>
								<div className='leftframe-topic-title'>
									Kendini İyi Hisset Filmleri
								</div>
								<span className='leftframe-topic-postcount'>12</span>
							</div>
						</div>
					</Link>
				</div>
			</div>
		);
	}
}
const RoutedConnectedEmbeddedTitleList = withRouter(
	connect(mapStateToProps)(EmbeddedTitleList)
);

class TitleList extends Component {
	constructor(props) {
		super(props);
		this.state = { selectedTopic: null };
	}

	handleSelectTopic = (e) => {
		const clickedTopicId = e.currentTarget.dataset.topicid;
		this.setState((prevState) => ({
			...prevState,
			selectedTopic: clickedTopicId,
		}));
	};

	render() {
		const loggedInUser = this.props.User;
		const url = this.props.location.pathname;

		const titlelistArea = this.props.downloading ? (
			this.props.isEventSelected ? (
				[...Array(5)].map((x, i) => (
					<div
						className='leftframe-topic-wrapper'
						key={'leftframe-topic-wrapper' + i}
					>
						<div className='leftframe-event-container'>
							<div className='leftframe-event'>
								<div className='leftframe-event-photo-container'>
									<div className='leftframe-event-photo-wrapper-skeleton'></div>
								</div>
								<div className='leftframe-event-text'>
									<div className='leftframe-event-date-skeleton'></div>
									<div className='leftframe-event-title-skeleton'></div>
								</div>
							</div>
						</div>
					</div>
				))
			) : (
				[...Array(15)].map((x, i) => (
					<div
						className='leftframe-topic-wrapper'
						key={'leftframe-topic-wrapper' + i}
					>
						<div className='leftframe-topic-container'>
							<span className='leftframe-topic-title-skeleton'></span>
							<span className='leftframe-topic-postcount-skeleton'></span>
						</div>
					</div>
				))
			)
		) : this.props.topics === undefined || this.props.topics.length === 0 ? (
			<div className='leftframe-topic-notfound'>Etkinlik bulunamadı.</div>
		) : (
			this.props.topics.map((Topic, index) => {
				let leftframeTopicWrapperClasses = classNames(
					'leftframe-topic-wrapper',
					{
						'leftframe-topic-wrapper-active':
							Topic.topic_id == this.state.selectedTopic &&
							url.includes('topic'),
					}
				);
				let liveIcon = null;
				if (
					moment().isBetween(
						moment(Topic.start_date),
						Topic.end_date
							? moment(Topic.end_date)
							: moment(Topic.start_date).add(1, 'hour')
					)
				) {
					liveIcon = (
						<span className='leftframe-event-live'>
							Başladı
							<span className='leftframe-event-live-icon'></span>
						</span>
					);
				}
				let freeIcon = null;
				if (Topic.isFree === 1) {
					freeIcon = <span className='leftframe-event-free'>Ücretsiz</span>;
				}
				return (
					<>
						<div
							className={leftframeTopicWrapperClasses}
							key={'leftframe-topic-wrapper' + index}
							id={'leftframe-topic-' + Topic.topic_id}
							data-topicid={Topic.topic_id}
							onClick={this.handleSelectTopic}
						>
							<Link to={{ pathname: '/topic/' + Topic.topic_id }}>
								{Topic.Category.isEvent ? (
									<div className='leftframe-event-container'>
										<div className='leftframe-event'>
											<div className='leftframe-event-photo-container'>
												<div className='leftframe-event-photo-wrapper'>
													<Image
														cloudName='di6klblik'
														publicId={Topic.Posts[0].post_photo}
														width='100%'
													>
														<Transformation
															radius='5'
															crop='fill'
															height='75'
															width='75'
														/>
													</Image>
												</div>
											</div>
											<div className='leftframe-event-text'>
												<div className='leftframe-event-date'>
													{Topic.end_date
														? moment(Topic.start_date).format(
																'Do MMMM YYYY'
														  ) ===
														  moment(Topic.end_date).format('Do MMMM YYYY')
															? moment(Topic.start_date).format(
																	'Do MMMM YYYY dddd'
															  ) +
															  ' ⋅ ' +
															  moment(Topic.start_date).format('HH:mm') +
															  ' - ' +
															  moment(Topic.start_date).format('HH:mm')
															: moment(Topic.start_date).format('MMMM') ===
															  moment(Topic.end_date).format('MMMM')
															? moment(Topic.start_date).format('Do') +
															  ' - ' +
															  moment(Topic.end_date).format('Do MMMM YYYY') +
															  ' ⋅ ' +
															  moment(Topic.end_date).format('HH:mm')
															: moment(Topic.start_date).format('Do MMMM') +
															  ' - ' +
															  moment(Topic.end_date).format('Do MMMM YYYY') +
															  ' ⋅ ' +
															  moment(Topic.start_date).format('HH:mm')
														: moment(Topic.start_date).format(
																'Do MMMM YYYY dddd'
														  ) +
														  ' ⋅ ' +
														  moment(Topic.start_date).format('HH:mm')}
												</div>
												<div className='leftframe-event-title'>
													{Topic.topic_title}
												</div>
												{liveIcon}
												{freeIcon}
											</div>
										</div>
									</div>
								) : (
									<div className='leftframe-topic-container'>
										<div className='leftframe-topic'>
											<div className='leftframe-topic-title'>
												{Topic.topic_title}
											</div>
											<span className='leftframe-topic-postcount'>
												{Topic.post_count}
											</span>
										</div>
									</div>
								)}
							</Link>
						</div>
						{/* {
          ((Topic.Category.isEvent === 1 && index % 6 === 2) || (this.props.isTopicSelected && index % 10 === 4))
          &&
          <div className="leftframe-topic-wrapper">
          <div className="leftframe-rekl-container">
          <AdSense.Google
            className="adsbygoogle"
            client='ca-pub-5093736351800898'
            slot='9164849165'
            layoutKey='-ef+7v-38-dp+10p'
            format='fluid'
          />
          </div>
          </div>
        } */}
					</>
				);
			})
		);

		let addTopicArea = null;
		if (
			loggedInUser !== undefined &&
			loggedInUser.id !== undefined &&
			loggedInUser.id != 0
		) {
			let leftframeTopicWrapperClasses = classNames(
				'leftframe-topic-wrapper',
				'leftframe-addtopic-wrapper',
				{
					'leftframe-topic-wrapper-active':
						'addtopic' == this.state.selectedTopic && url.includes('topic'),
				}
			);
			let addtopicText = classNames(
				{ 'Etkinlik Ekle': this.props.isEventSelected },
				{ 'Konu Ekle': this.props.isTopicSelected }
			);
			addTopicArea = (
				<div
					className={leftframeTopicWrapperClasses}
					data-topicid='addtopic'
					onClick={this.handleSelectTopic}
				>
					<Link to={{ pathname: '/topic/draft' }}>
						<div className='leftframe-topic-container'>
							<div className='leftframe-topic'>
								<span className='leftframe-topic-title'>{addtopicText}</span>
								<span className='leftframe-topic-postcount'>+</span>
							</div>
						</div>
					</Link>
				</div>
			);
		}
		return (
			<div
				id='leftframe-topics-container'
				className='leftframe-topics-container'
			>
				<div className='leftframe-topiclist'>
					{titlelistArea}
					{addTopicArea}
				</div>
			</div>
		);
	}
}
const RoutedConnectedTitleList = withRouter(
	connect(mapStateToProps)(TitleList)
);

class LeftFrame extends Component {
	constructor(props) {
		super(props);
		this.state = {
			topics: [],
			isMobileLeftFrameHidden: this.props.isMobileLeftFrameHidden,
			isDateDropdownHidden: true,
			isCategoryDropdownHidden: true,
			isCityDropdownHidden: true,
			search: {
				isSearchActive: false,
				keyword: '',
			},
			category: {
				isEventSelected: this.props.category.isEventSelected,
				isTopicSelected: this.props.category.isTopicSelected,
			},
			filter: {
				categoryName: 'Tüm Kategoriler',
				startDate: undefined,
				endDate: undefined,
			},
			pagination: {
				isPagingHidden: true,
				current_page: 1,
				total_page: 1,
			},
			downloading: true,
		};
		this.leftframeRef = React.createRef();
		this.leftframeToggleButtonContainerRef = React.createRef();
		this.categoryDropdownRef = React.createRef();
		this.cityDropdownRef = React.createRef();
		this.topicRef = React.createRef();
		this.embeddedTopicRef = React.createRef();
		this.handleClickOutsideCategoryDropdown =
			this.handleClickOutsideCategoryDropdown.bind(this);
		this.handleClickOutsideCityDropdown =
			this.handleClickOutsideCityDropdown.bind(this);
	}

	componentDidMount() {
		if (this.props.User.id !== null) {
			if (this.state.category.isEventSelected) {
				this.getLatestEvents();
			} else {
				this.getLatestTopics();
			}
		}

		window.addEventListener('click', this.handleClickOutsideCityDropdown, true);
		window.addEventListener(
			'touchstart',
			this.handleClickOutsideCityDropdown,
			true
		);
		window.addEventListener(
			'click',
			this.handleClickOutsideCategoryDropdown,
			true
		);
		window.addEventListener(
			'touchstart',
			this.handleClickOutsideCategoryDropdown,
			true
		);
	}

	componentWillUnmount() {
		window.removeEventListener(
			'click',
			this.handleClickOutsideCityDropdown,
			true
		);
		window.removeEventListener(
			'touchstart',
			this.handleClickOutsideCityDropdown,
			true
		);
		window.removeEventListener(
			'click',
			this.handleClickOutsideCategoryDropdown,
			true
		);
		window.removeEventListener(
			'touchstart',
			this.handleClickOutsideCategoryDropdown,
			true
		);
	}

	componentDidUpdate(prevProps, prevState) {
		//TODO memory leak
		if (
			(this.props.id !== prevProps.id &&
				this.props.isMobileLeftFrameHidden !==
					prevProps.isMobileLeftFrameHidden) ||
			this.props.category !== prevProps.category ||
			this.props.location !== prevProps.location ||
			this.props.User !== prevProps.User ||
			this.props.City !== prevProps.City ||
			this.state.filter.startDate !== prevState.filter.startDate ||
			this.state.filter.endDate !== prevState.filter.endDate ||
			this.state.filter.categoryName !== prevState.filter.categoryName
		) {
			this.resetPagination();
			if (this.props.search.isSearchActive) {
				this.findTopics(
					this.props.search.keyword,
					1,
					this.state.category.isEventSelected
				);
			} else {
				if (this.state.category.isEventSelected) {
					this.getLatestEvents();
				} else {
					this.getLatestTopics();
				}
			}
			if (!this.props.isMobileLeftFrameHidden) {
				this.setState((prevState) => ({
					...prevState,
					isMobileLeftFrameHidden: this.props.isMobileLeftFrameHidden,
				}));
			}
		}

		if (
			this.props.id !== prevProps.id &&
			this.props.isMobileLeftFrameHidden === prevProps.isMobileLeftFrameHidden
		) {
			this.setState((prevState) => ({
				...prevState,
				isMobileLeftFrameHidden: this.props.isMobileLeftFrameHidden,
			}));
		}
		if (
			this.state.isMobileLeftFrameHidden !== prevState.isMobileLeftFrameHidden
		) {
			//TODO: event listener ile media query değişiyor mu kontrol et
			const html = document.getElementsByTagName('HTML');
			if (
				null != html &&
				html.length !== 0 &&
				!this.state.isMobileLeftFrameHidden &&
				window.matchMedia('(max-width: 35em)').matches
			) {
				html[0].style.overflow = 'hidden';
			} else {
				html[0].style.overflow = 'auto';
			}
		}

		if (
			this.props.category != null &&
			this.props.category !== prevProps.category
		) {
			this.resetPagination();
			this.setState((prevState) => ({
				...prevState,
				category: {
					...prevState.category,
					isEventSelected: this.props.category.isEventSelected,
					isTopicSelected: this.props.category.isTopicSelected,
				},
			}));
			if (this.props.category.isEventSelected) {
				this.getLatestEvents();
			} else {
				this.getLatestTopics();
			}
		}
	}

	findTopics = (keyword, targetpagenumber, eventsonly) => {
		if (!keyword) {
			return;
		}
		this.setState((prevState) => ({
			...prevState,
			downloading: true,
		}));
		fetch(API_DIRECTORY + '/findTopics', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				city_id: this.props.City.id,
				topic_search_keyword: keyword,
				targetpagenumber: targetpagenumber,
				eventsonly: eventsonly,
			}),
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else throw new Error('Bağlantı hatası.');
			})
			.then((responseFindTopics) => {
				if (responseFindTopics.status === 'success') {
					this.setState((prevState) => ({
						...prevState,
						topics: responseFindTopics.TopicList,
					}));
					if (responseFindTopics.totaltopiccount > 10)
						this.setState((prevState) => ({
							...prevState,
							pagination: {
								...prevState.pagination,
								isPagingHidden: false,
								total_page: Math.ceil(responseFindTopics.totaltopiccount / 10),
							},
						}));
					else {
						this.setState((prevState) => ({
							...prevState,
							pagination: {
								...prevState.pagination,
								isPagingHidden: true,
								current_page: 1,
								total_page: 1,
							},
						}));
					}
					this.props.updateTopic(keyword, responseFindTopics.Topic);
					if (responseFindTopics.Topic) {
						this.props.updateLeftFrame(true);
					}
				} else {
					this.props.openDialog(
						responseFindTopics.status,
						responseFindTopics.message
					);
				}
				this.setState((prevState) => ({
					...prevState,
					downloading: false,
				}));
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	getLatestEvents = (targetpagenumber) => {
		this.setState((prevState) => ({
			...prevState,
			downloading: true,
		}));
		fetch(API_DIRECTORY + '/getLatestEvents', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				city_id: this.props.City.id,
				targetpagenumber: targetpagenumber ?? 1,
				start_date: this.state.filter.startDate,
				end_date: this.state.filter.endDate,
				category_name: this.state.filter.categoryName,
			}),
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else throw new Error('Bağlantı hatası.');
			})
			.then((responseLatestTopics) => {
				if (responseLatestTopics.status === 'success') {
					this.setState((prevState) => ({
						...prevState,
						topics: responseLatestTopics.TopicList,
					}));
					if (responseLatestTopics.totaltopiccount > 6) {
						this.setState((prevState) => ({
							...prevState,
							pagination: {
								...prevState.pagination,
								isPagingHidden: false,
								total_page: Math.ceil(responseLatestTopics.totaltopiccount / 6),
							},
						}));
					} else {
						this.resetPagination();
					}
				} else {
					this.props.openDialog(
						responseLatestTopics.status,
						responseLatestTopics.message
					);
				}
				this.setState((prevState) => ({
					...prevState,
					downloading: false,
				}));
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	getLatestTopics = (targetpagenumber) => {
		this.setState((prevState) => ({
			...prevState,
			downloading: true,
		}));
		fetch(API_DIRECTORY + '/getLatestTopics', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				targetpagenumber: targetpagenumber ?? 1,
			}),
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else throw new Error('Bağlantı hatası.');
			})
			.then((responseLatestTopics) => {
				if (responseLatestTopics.status === 'success') {
					this.setState((prevState) => ({
						...prevState,
						topics: responseLatestTopics.TopicList,
					}));
					if (responseLatestTopics.totaltopiccount > 10)
						this.setState((prevState) => ({
							...prevState,
							pagination: {
								...prevState.pagination,
								isPagingHidden: false,
								total_page: Math.ceil(
									responseLatestTopics.totaltopiccount / 10
								),
							},
						}));
				} else {
					this.props.openDialog(
						responseLatestTopics.status,
						responseLatestTopics.message
					);
				}
				this.setState((prevState) => ({
					...prevState,
					downloading: false,
				}));
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	resetPagination = () => {
		this.setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				isPagingHidden: true,
				current_page: 1,
				total_page: 1,
			},
		}));
	};

	handleClickDateDropdown = () => {
		this.setState((prevState) => ({
			...prevState,
			isDateDropdownHidden: !prevState.isDateDropdownHidden,
		}));
	};
	handleClickOutsideDateDropdown = () => {
		this.setState((prevState) => ({
			...prevState,
			isDateDropdownHidden: !prevState.isDateDropdownHidden,
		}));
	};
	handleChangeDate = (selectedDate, e) => {
		//TODO: Use ref for classes from imported components
		let closeIcon = document.querySelector(
			'.leftframe-topics-dateinfo-close-icon'
		);

		if (closeIcon && e.target.contains(closeIcon)) {
			this.setState((prevState) => ({
				...prevState,
				filter: {
					...prevState.filter,
					startDate: undefined,
					endDate: undefined,
				},
			}));
			return;
		}

		let isStartDateSelected = this.state.filter.startDate;

		if (isStartDateSelected) {
			this.setState((prevState) => ({
				...prevState,
				filter: {
					...prevState.filter,
					endDate: selectedDate,
				},
			}));
		} else {
			this.setState((prevState) => ({
				...prevState,
				filter: {
					...prevState.filter,
					startDate: selectedDate,
				},
			}));
		}
	};

	handleClickCategoryDropdown = () => {
		this.setState((prevState) => ({
			...prevState,
			isCategoryDropdownHidden: !prevState.isCategoryDropdownHidden,
		}));
	};
	handleClickOutsideCategoryDropdown = (e) => {
		const isContainerCategoryclicked =
			this.categoryDropdownRef &&
			this.categoryDropdownRef.current.contains(e.target);

		if (!isContainerCategoryclicked) {
			this.setState((prevState) => ({
				...prevState,
				isCategoryDropdownHidden: true,
			}));
		}
	};
	handleChangeCategory = (e) => {
		const categoryName = e.currentTarget.dataset.categoryname;
		this.resetPagination();

		this.setState((prevState) => ({
			...prevState,
			filter: {
				...prevState.filter,
				categoryName: categoryName,
			},
		}));
	};

	handleClickCityDropdown = () => {
		this.setState((prevState) => ({
			...prevState,
			isCityDropdownHidden: !prevState.isCityDropdownHidden,
		}));
	};
	handleClickOutsideCityDropdown = (e) => {
		const isContainerCityClicked =
			this.cityDropdownRef && this.cityDropdownRef.current.contains(e.target);

		if (!isContainerCityClicked) {
			this.setState((prevState) => ({
				...prevState,
				isCityDropdownHidden: true,
			}));
		}
	};
	handleChangeCity = (selectedCity) => {
		const cityName = getCityName(selectedCity);
		this.resetPagination();

		const currentCity = { id: selectedCity, name: cityName };
		this.props.setCity(currentCity);
		setCookie('city', currentCity.id, 365);
	};

	handleClickCategoryEvent = () => {
		this.resetPagination();

		if (this.props.search.isSearchActive) {
			this.findTopics(this.props.search.keyword, 1, true);
		} else {
			this.getLatestEvents();
		}
		this.setState((prevState) => ({
			...prevState,
			category: {
				...prevState.category,
				isEventSelected: true,
				isTopicSelected: false,
			},
		}));
	};

	handleClickCategoryTopic = () => {
		this.resetPagination();

		if (this.props.search.isSearchActive) {
			this.findTopics(this.props.search.keyword, 1, false);
		} else {
			this.getLatestTopics();
		}
		this.setState((prevState) => ({
			...prevState,
			category: {
				...prevState.category,
				isEventSelected: false,
				isTopicSelected: true,
			},
		}));
	};

	handleClickPaginationPreviousPage = () => {
		if (this.state.pagination.current_page - 1 >= 1) {
			this.setState((prevState) => ({
				...prevState,
				pagination: {
					...prevState.pagination,
					current_page: this.state.pagination.current_page - 1,
				},
			}));
			if (this.props.search.isSearchActive) {
				this.findTopics(
					this.props.search.keyword,
					this.state.pagination.current_page - 1,
					this.state.category.isEventSelected
				);
			} else {
				if (this.state.category.isEventSelected) {
					this.getLatestEvents(this.state.pagination.current_page - 1);
				} else {
					this.getLatestTopics(this.state.pagination.current_page - 1);
				}
			}
		}
	};
	handleClickPaginationCustomPage = () => {
		const custom_page = parseInt(event.target.value);
		this.setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				current_page: custom_page,
			},
		}));
		if (this.props.search.isSearchActive) {
			this.findTopics(
				this.props.search.keyword,
				custom_page,
				this.state.category.isEventSelected
			);
		} else {
			if (this.state.category.isEventSelected) {
				this.getLatestEvents(custom_page);
			} else {
				this.getLatestTopics(custom_page);
			}
		}
	};
	handleClickPaginationFinalPage = () => {
		this.setState((prevState) => ({
			...prevState,
			pagination: {
				...prevState.pagination,
				current_page: this.state.pagination.total_page,
			},
		}));
		if (this.props.search.isSearchActive) {
			this.findTopics(
				this.props.search.keyword,
				this.state.pagination.total_page,
				this.state.category.isEventSelected
			);
		} else {
			if (this.state.category.isEventSelected) {
				this.getLatestEvents(this.state.pagination.total_page);
			} else {
				this.getLatestTopics(this.state.pagination.total_page);
			}
		}
	};
	handleClickPaginationNextPage = () => {
		if (
			this.state.pagination.current_page + 1 <=
			this.state.pagination.total_page
		) {
			this.setState((prevState) => ({
				...prevState,
				pagination: {
					...prevState.pagination,
					current_page: this.state.pagination.current_page + 1,
				},
			}));
			if (this.props.search.isSearchActive) {
				this.findTopics(
					this.props.search.keyword,
					this.state.pagination.current_page + 1,
					this.state.category.isEventSelected
				);
			} else {
				if (this.state.category.isEventSelected) {
					this.getLatestEvents(this.state.pagination.current_page + 1);
				} else {
					this.getLatestTopics(this.state.pagination.current_page + 1);
				}
			}
		}
	};

	handleMobileLeftFrame = (e) => {
		const isLeftframeClicked =
			this.leftframeRef &&
			this.leftframeRef.current &&
			this.leftframeRef.current.contains(e.target);
		const isLeftframeToggleButtonClicked =
			this.leftframeToggleButtonContainerRef &&
			this.leftframeToggleButtonContainerRef.current &&
			this.leftframeToggleButtonContainerRef.current.contains(e.target);
		const isAnyTopicClicked =
			this.topicRef &&
			this.topicRef.current &&
			this.topicRef.current.contains(e.target);
		const isAnyEmbeddedTopicClicked =
			this.embeddedTopicRef &&
			this.embeddedTopicRef.current &&
			this.embeddedTopicRef.current.contains(e.target);

		if (this.state.isMobileLeftFrameHidden) {
			if (isLeftframeToggleButtonClicked) {
				this.setState((prevState) => ({
					...prevState,
					isMobileLeftFrameHidden: false,
				}));
			}
		} else {
			if (
				isLeftframeToggleButtonClicked ||
				!isLeftframeClicked ||
				isAnyTopicClicked ||
				isAnyEmbeddedTopicClicked
			) {
				this.setState((prevState) => ({
					...prevState,
					isMobileLeftFrameHidden: true,
				}));
			}
		}
	};

	render() {
		let leftframeContainerClasses = classNames('leftframe-container', {
			'leftframe-container-active': !this.state.isMobileLeftFrameHidden,
		});
		let leftframeClasses = classNames('leftframe', {
			'leftframe-active': !this.state.isMobileLeftFrameHidden,
		});
		let categoryEventClasses = classNames('category', {
			'category-active': this.state.category.isEventSelected,
		});
		let categoryTopicClasses = classNames('category', {
			'category-active': this.state.category.isTopicSelected,
		});

		let describeArea = null;

		if (this.props.search.isSearchActive) {
			let notfoundText = null;
			if (this.state.topics.length === 0) {
				notfoundText = (
					<span className='leftframe-search-notfound'>
						Aradığınız kriterlere uygun sonuç bulunamadı.
					</span>
				);
			}
			describeArea = (
				<div
					className='leftframe-search-container'
					id='leftframe-search-container'
				>
					<div className='leftframe-search'>
						<span className='leftframe-search-text'>Arama Sonuçları</span>
						<span
							className='leftframe-search-close'
							onClick={this.props.updateLeftFrame}
						></span>
					</div>
					{notfoundText}
				</div>
			);
		} else {
			describeArea = (
				<div
					className='leftframe-categories-container'
					id='leftframe-categories-container'
				>
					<div className='categories'>
						<div
							className={categoryEventClasses}
							onClick={this.handleClickCategoryEvent}
						>
							ETKİNLİKLER
						</div>
						<div
							className={categoryTopicClasses}
							onClick={this.handleClickCategoryTopic}
						>
							KONULAR
						</div>
					</div>
				</div>
			);
		}

		let filtersArea = null;
		if (this.state.category.isEventSelected) {
			let datepickerArea = null;
			// if (!this.state.isDateDropdownHidden) {
			datepickerArea = (
				<DatePicker
					id='leftframe-topics-dateinfo'
					className='leftframe-topics-dateinfo'
					// startOpen={true}
					selected={this.state.filter.startDate}
					startDate={this.state.filter.startDate}
					endDate={this.state.filter.endDate}
					selectsEnd={Boolean(this.state.filter.startDate)}
					minDate={this.state.filter.startDate}
					dateFormat='d MMMM yyyy'
					isClearable={true}
					clearButtonClassName='leftframe-topics-dateinfo-close-icon'
					onClick={this.handleClickDateDropdown}
					onClickOutside={this.handleClickOutsideDateDropdown}
					onChange={this.handleChangeDate}
					popperClassName='leftframe-topics-dateinfo-popper'
					customInput={
						this.state.filter.startDate ? (
							<span className='leftframe-topics-dateinfo-text'>
								{this.state.filter.endDate ? (
									moment(this.state.filter.startDate).format('Do MMMM YYYY') +
									' –\n' +
									moment(this.state.filter.endDate).format('Do MMMM YYYY')
								) : (
									<span>
										{moment(this.state.filter.startDate).format('Do MMMM YYYY')}
									</span>
								)}
							</span>
						) : (
							<span>Tüm Tarihler</span>
						)
					}
				/>
			);
			// }
			filtersArea = (
				<div
					className='leftframe-filters-container'
					id='leftframe-filters-container'
				>
					<div
						className='leftframe-topics-dateinfo-container'
						style={{
							display: this.state.category.isEventSelected ? 'block' : 'none',
						}}
					>
						<div className='leftframe-topics-dateinfo-icon-wrapper'>
							<span className='leftframe-topics-dateinfo-icon'>
								<FontAwesomeIcon icon={faCalendarAlt} color='#2F2F3C' />
							</span>
						</div>
						<div
							className='leftframe-topics-dateinfo-wrapper'
							onClick={this.handleClickOutsideDateDropdown}
						>
							{datepickerArea}
							<div className='leftframe-topics-dateinfo-dropdownicon-container'>
								<div className='leftframe-topics-dateinfo-dropdownicon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
					</div>
					<div
						className='leftframe-topics-categoryinfo-container'
						ref={this.categoryDropdownRef}
						style={{
							display: this.state.category.isEventSelected ? 'block' : 'none',
						}}
					>
						<div className='leftframe-topics-categoryinfo-icon-wrapper'>
							<span className='leftframe-topics-categoryinfo-icon'>
								<FontAwesomeIcon icon={faEye} color='#2F2F3C' />
							</span>
						</div>
						<div className='leftframe-topics-categoryinfo-wrapper'>
							<div
								className='leftframe-topics-categoryinfo'
								id='leftframe-topics-categoryinfo'
								onClick={this.handleClickCategoryDropdown}
							>
								<div className='leftframe-topics-categoryinfo-dropdown-selected'>
									<div className='leftframe-topics-category-selected'>
										{this.state.filter.categoryName}
									</div>
								</div>
								<div
									className='leftframe-topics-categoryinfo-dropdown'
									id='leftframe-topics-categoryinfo-dropdown'
									style={{
										display: this.state.isCategoryDropdownHidden
											? 'none'
											: 'block',
									}}
								>
									<div
										className='leftframe-topics-category'
										data-categoryname='Tüm Kategoriler'
										onClick={this.handleChangeCategory}
									>
										Tüm Kategoriler
									</div>
									<div
										className='leftframe-topics-category'
										data-categoryname='Konser'
										onClick={this.handleChangeCategory}
									>
										Konser
									</div>
									<div
										className='leftframe-topics-category'
										data-categoryname='Sahne / Sergi / Sinema'
										onClick={this.handleChangeCategory}
									>
										Sahne / Sergi / Sinema
									</div>
									<div
										className='leftframe-topics-category'
										data-categoryname='Eğitim / Söyleşi / Sohbet'
										onClick={this.handleChangeCategory}
									>
										Eğitim / Söyleşi / Sohbet
									</div>
									<div
										className='leftframe-topics-category'
										data-categoryname='Gösteri'
										onClick={this.handleChangeCategory}
									>
										Gösteri
									</div>
								</div>
							</div>
							<div className='leftframe-topics-categoryinfo-dropdownicon-container'>
								<div className='leftframe-topics-categoryinfo-dropdownicon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
					</div>
					<div
						className='leftframe-topics-cityinfo-container'
						ref={this.cityDropdownRef}
						style={{
							display: this.state.category.isEventSelected ? 'block' : 'none',
						}}
					>
						<div className='leftframe-topics-cityinfo-icon-wrapper'>
							<span className='leftframe-topics-cityinfo-icon'>
								<FontAwesomeIcon icon={faMapMarkerAlt} color='#2F2F3C' />
							</span>
						</div>
						<div className='leftframe-topics-cityinfo-wrapper'>
							<div
								className='leftframe-topics-cityinfo'
								id='leftframe-topics-cityinfo'
								onClick={this.handleClickCityDropdown}
							>
								<div className='leftframe-topics-cityinfo-dropdown-selected'>
									<div className='leftframe-topics-city-selected'>
										{this.props.City.name}
									</div>
								</div>
								<div
									className='leftframe-topics-cityinfo-dropdown'
									id='leftframe-topics-cityinfo-dropdown'
									style={{
										display: this.state.isCityDropdownHidden ? 'none' : 'block',
									}}
								>
									<div
										className='leftframe-topics-city'
										data-cityid='82'
										onClick={() => this.handleChangeCity('82')}
									>
										Online
									</div>
									<div
										className='leftframe-topics-city'
										data-cityid='34'
										onClick={() => this.handleChangeCity('34')}
									>
										İstanbul
									</div>
									<div
										className='leftframe-topics-city'
										data-cityid='35'
										onClick={() => this.handleChangeCity('35')}
									>
										İzmir
									</div>
									<div
										className='leftframe-topics-city'
										data-cityid='6'
										onClick={() => this.handleChangeCity('6')}
									>
										Ankara
									</div>
								</div>
							</div>
							<div className='leftframe-topics-cityinfo-dropdownicon-container'>
								<div className='leftframe-topics-cityinfo-dropdownicon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		let embeddedArea = null;
		if (this.state.category.isTopicSelected) {
			embeddedArea = (
				<>
					{' '}
					<div className='leftframe-topics-title'>Derlemeler</div>
					<div
						className='leftframe-topics-container'
						ref={this.embeddedTopicRef}
					>
						<RoutedConnectedEmbeddedTitleList />
					</div>
					<div className='leftframe-topics-title'>Gönderiler</div>
				</>
			);
		}

		let pagingArea = null;
		if (!this.state.pagination.isPagingHidden) {
			pagingArea = (
				<div className='leftframe-paging-container'>
					<div className='leftframe-paging'>
						<div
							className='leftframe-paging-page leftframe-paging-previouspage'
							onClick={this.handleClickPaginationPreviousPage}
						>
							&#8249;
						</div>

						<div className='leftframe-paging-currentpage-container'>
							<select
								className='leftframe-paging-currentpage'
								value={this.state.pagination.current_page}
								onChange={this.handleClickPaginationCustomPage}
							>
								{this.state.pagination.total_page !== null &&
									[...Array(this.state.pagination.total_page)].map((x, i) => (
										<option key={i + 1} value={i + 1}>
											{i + 1}
										</option>
									))}
							</select>
							<div className='leftframe-paging-currentpage-icon-container'>
								<div className='leftframe-paging-currentpage-icon'>
									<FontAwesomeIcon icon={faCaretDown} color='#2F2F3C' />
								</div>
							</div>
						</div>
						<div className='leftframe-paging-page-seperator'>/</div>
						<div
							className='leftframe-paging-page leftframe-paging-finalpage'
							onClick={this.handleClickPaginationFinalPage}
						>
							{this.state.pagination.total_page}
						</div>
						<div
							className='leftframe-paging-page leftframe-paging-nextpage'
							onClick={this.handleClickPaginationNextPage}
						>
							&#8250;
						</div>
					</div>
				</div>
			);
		}
		return (
			<div
				id='leftframe-container'
				className={leftframeContainerClasses}
				onClick={this.handleMobileLeftFrame}
			>
				<div
					className={leftframeClasses}
					id='leftframe'
					ref={this.leftframeRef}
				>
					{describeArea}
					{filtersArea}
					{embeddedArea}
					{pagingArea}
					<div ref={this.topicRef}>
						<RoutedConnectedTitleList
							topics={this.state.topics}
							search={this.state.search}
							isEventSelected={this.state.category.isEventSelected}
							isTopicSelected={this.state.category.isTopicSelected}
							downloading={this.state.downloading}
						/>
					</div>
					{pagingArea}
					<div
						id='leftframe-toggle-button-container'
						className='leftframe-toggle-button-container'
						ref={this.leftframeToggleButtonContainerRef}
					>
						<div className='leftframe-toggle-button-wrapper'>
							<FontAwesomeIcon icon={faAngleDoubleRight} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, { setCity })(LeftFrame);
