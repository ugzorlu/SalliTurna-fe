import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';

import CredentialModal from './CredentialModal.js';
import { API_DIRECTORY } from '../utils/constants.js';
import { setUserCredentials } from '../actions/userActions.js';
import '../styles/App.scss';
import '../styles/TopBar.scss';

const mapStateToProps = (state) => {
	return {
		User: state.user,
		City: state.city,
	};
};

class TopBar extends Component {
	constructor(props) {
		super(props);
		this.checkUserLogIn();
		this.state = {
			search: {
				isSearchDropdownHidden: true,
				isMobileSearchHidden: true,
				keyword: this.props.keyword,
				topics: [],
			},
			modal: {
				isModalHidden: true,
				isRegisterMenuActive: false,
				isLoginMenuActive: false,
			},
			unreadmessagecount: 0,
		};
		this.dropdownSearchRef = React.createRef();
		this.containerSearchRef = React.createRef();
		this.searchInputRef = React.createRef();
		this.handleClickOutsideOfSearchArea =
			this.handleClickOutsideOfSearchArea.bind(this);
	}

	openModalWithMenu = (component, isMenuTitleRegister) => {
		component.setState((prevState) => ({
			...prevState,
			modal: {
				...prevState.modal,
				isModalHidden: false,
				isRegisterMenuActive: isMenuTitleRegister,
				isLoginMenuActive: !isMenuTitleRegister,
			},
		}));
	};
	openModalWithRegisterMenu = () => {
		this.openModalWithMenu(this, true); //Boolean parameter is used for optimizing performance. True for register menu.
	};
	openModalWithLoginMenu = () => {
		this.openModalWithMenu(this, false); //Boolean parameter is used for optimizing performance. False for login menu.
	};

	closeModal = () => {
		this.setState((prevState) => ({
			...prevState,
			modal: {
				...prevState.modal,
				isModalHidden: true,
				isLoginMenuActive: false,
				isRegisterMenuActive: false,
			},
		}));
	};

	toggleModalMenu = (e) => {
		if (
			undefined !== e &&
			e.target.id === 'credentials-modal-menutitle-register'
		)
			this.setState((prevState) => ({
				...prevState,
				modal: {
					...prevState.modal,
					isLoginMenuActive: false,
					isRegisterMenuActive: true,
				},
			}));
		else if (
			undefined !== e &&
			e.target.id === 'credentials-modal-menutitle-login'
		)
			this.setState((prevState) => ({
				...prevState,
				modal: {
					...prevState.modal,
					isLoginMenuActive: true,
					isRegisterMenuActive: false,
				},
			}));
	};

	checkUserLogIn() {
		fetch(API_DIRECTORY + '/getUser', {
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else throw new Error('Bağlantı hatası.');
			})
			.then((responseUser) => {
				let currentUser = { id: 0, username: '' };

				if (undefined !== responseUser.userProfile) {
					currentUser = {
						id: responseUser.userProfile.user_id,
						username: responseUser.userProfile.user_name,
					};
					if (responseUser.userProfile.receiver.length) {
						this.setState((prevState) => ({
							...prevState,
							unreadmessagecount:
								responseUser.userProfile.receiver[0].unread_count,
						}));
					}
				}
				this.props.setUserCredentials(currentUser);
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	}
	componentDidMount() {
		window.addEventListener('click', this.handleClickOutsideOfSearchArea, true);
		window.addEventListener(
			'touchstart',
			this.handleClickOutsideOfSearchArea,
			true
		);
	}
	componentWillUnmount() {
		window.removeEventListener(
			'click',
			this.handleClickOutsideOfSearchArea,
			true
		);
		window.removeEventListener(
			'touchstart',
			this.handleClickOutsideOfSearchArea,
			true
		);
	}

	componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			this.resetSearchBar();
		}
	}

	resetSearchBar = () => {
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				isSearchDropdownHidden: true,
				isMobileSearchHidden: true,
				keyword: this.props.keyword,
				topics: [],
			},
		}));
	};

	handleClickOutsideOfSearchArea = (e) => {
		const isDropdownSearchClicked =
			this.dropdownSearchRef &&
			this.dropdownSearchRef.current.contains(e.target);
		const isContainerSearchClicked =
			this.containerSearchRef &&
			this.containerSearchRef.current.contains(e.target);
		const isSearchClicked = isDropdownSearchClicked || isContainerSearchClicked;
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				isSearchDropdownHidden: !isSearchClicked,
				isMobileSearchHidden: !isSearchClicked,
			},
		}));
	};

	getSmartSearchGuess = (keyword) => {
		fetch(API_DIRECTORY + '/getSmartSearchGuess', {
			method: 'post',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({
				topic_search_keyword: keyword,
			}),
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else throw new Error('Bağlantı hatası.');
			})
			.then((responseGetSmartSearchGuess) => {
				if (responseGetSmartSearchGuess.status === 'success') {
					this.setState((prevState) => ({
						...prevState,
						search: {
							...prevState.search,
							topics: responseGetSmartSearchGuess.TopicList,
						},
					}));
				} else {
					this.props.openDialog(
						responseGetSmartSearchGuess.status,
						responseGetSmartSearchGuess.message
					);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	handleRouteGuessedTopic = (e) => {
		const topic_id = e.currentTarget.dataset.topicid;
		this.props.history.push('/topic/' + topic_id);
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				isSearchDropdownHidden: true,
			},
		}));
	};

	handleChangeSearchBar = () => {
		const keyword = this.searchInputRef.current.value;
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				isSearchDropdownHidden: false,
				keyword: keyword,
			},
		}));
		this.getSmartSearchGuess(keyword);
	};

	handleClearSearchBar = () => {
		this.setState((prevState) => ({
			...prevState,
			search: {
				...prevState.search,
				isSearchDropdownHidden: true,
				keyword: '',
				topics: [],
			},
		}));
		this.searchInputRef.current.focus();
	};

	handleClickSearchButton = () => {
		const keyword = this.searchInputRef.current.value;
		if (keyword == null || keyword == '') {
			this.props.openDialog('info', 'Arama alanına kelime girişi yapmadınız.');
		} else {
			this.props.searchTopics(keyword);
		}
	};

	handleMobileSearch = () => {
		//TODO Bug-Cannot get second search results
		if (this.state.search.isMobileSearchHidden) {
			this.setState((prevState) => ({
				...prevState,
				search: {
					...prevState.search,
					isMobileSearchHidden: false,
				},
			}));
		}
	};

	handleMobileLeftFrame = () => {
		this.props.updateLeftFrame(false);
	};

	handleLogOut = () => {
		fetch(API_DIRECTORY + '/logOut', {
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else throw new Error('Bağlantı hatası.');
			})
			.then((responseLogout) => {
				if (responseLogout.status === 'success') {
					const currentUser = { id: 0, username: '' };
					this.props.setUserCredentials(currentUser);
				} else {
					this.props.openDialog(responseLogout.status, responseLogout.message);
				}
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	render() {
		const loggedInUser = this.props.User;

		const logoArea = (
			<div className='logo-container'>
				<div className='logo'></div>
				<div className='textlogo'></div>
			</div>
		);

		let mainSearchContainerClasses = classNames(
			'topbar-item',
			'main-search-container',
			{
				'main-search-container-active': !this.state.search.isMobileSearchHidden,
			}
		);
		let searchContainerClasses = classNames('search-container', {
			'search-container-active': !this.state.search.isMobileSearchHidden,
		});
		let searchTopClasses = classNames('search-top', {
			'search-top-active': !this.state.search.isMobileSearchHidden,
		});
		let searchDropdownClasses = classNames('search-dropdown', {
			'search-dropdown-active': !this.state.search.isMobileSearchHidden,
		});
		let btnSearchClasses = classNames('btn-search', {
			'btn-search-active': !this.state.search.isMobileSearchHidden,
		});

		let searchArea = (
			<>
				<div
					className={mainSearchContainerClasses}
					onClick={this.handleMobileSearch}
				>
					<div
						id='search-container'
						className={searchContainerClasses}
						ref={this.containerSearchRef}
					>
						<input
							id='search-top'
							ref={this.searchInputRef}
							value={this.state.search.keyword}
							onChange={this.handleChangeSearchBar}
							type='text'
							className={searchTopClasses}
							autoComplete='off'
							placeholder='Etkinlik ya da konu ara...'
						/>
						<span
							className='search-clear'
							style={{
								display:
									this.state.search.keyword.length &&
									!this.state.search.isSearchDropdownHidden
										? 'inline'
										: 'none',
							}}
							onClick={this.handleClearSearchBar}
						>
							✖
						</span>
					</div>
					<div
						className={btnSearchClasses}
						id='btn-search'
						onClick={this.handleClickSearchButton}
					>
						Ara
					</div>
					<div
						id='search-dropdown'
						className={searchDropdownClasses}
						ref={this.dropdownSearchRef}
						style={{
							display: this.state.search.isSearchDropdownHidden
								? 'none'
								: 'inline-block',
						}}
					>
						{this.state.search.topics !== undefined &&
							this.state.search.topics.map((Topic) => (
								<div
									className='search-dropdown-topic-wrapper'
									onClick={this.handleRouteGuessedTopic}
									data-topicid={Topic.topic_id}
									key={Topic.topic_id}
								>
									<span className='search-dropdown-topic-title'>
										{Topic.topic_title}
									</span>
									<span className='search-dropdown-topic-categoryname'>
										({Topic.Category.category_name})
									</span>
								</div>
							))}
					</div>
				</div>
				<div
					id='topbar-toggleleftframe-container'
					className='topbar-item topbar-toggleleftframe-container'
					onClick={this.handleMobileLeftFrame}
				>
					<FontAwesomeIcon icon={faAlignJustify} color='#FFF' />
				</div>
			</>
		);

		let menuArea = null;
		if (
			loggedInUser === undefined ||
			loggedInUser.id === undefined ||
			loggedInUser.id == 0
		) {
			menuArea = (
				<ul className='menu-nav'>
					<li
						className='topbar-item menu-item menu-item-register'
						id='menu-item-register'
						onClick={this.openModalWithRegisterMenu}
					></li>
					<li className='menu-item-separator'></li>
					<li
						className='topbar-item menu-item menu-item-login'
						id='menu-item-login'
						onClick={this.openModalWithLoginMenu}
					></li>
				</ul>
			);
		} else if (
			//Check is unnecessary. It is there for react-router compatibility issues.
			loggedInUser.id
		) {
			let menuItemInbox = classNames(
				'topbar-item',
				'menu-item',
				'menu-item-inbox',
				{
					'menu-item-inbox-unread': this.state.unreadmessagecount > 0,
				}
			);
			menuArea = (
				<ul className='menu-nav'>
					<Link to={{ pathname: '/profile/' + loggedInUser.id }}>
						<li
							className='topbar-item menu-item menu-item-myaccount'
							id='menu-item-myaccount'
						>
							{loggedInUser.username.toUpperCase()}
						</li>
					</Link>
					<li className='menu-item-separator'></li>
					<Link to={{ pathname: '/inbox' }}>
						<li className={menuItemInbox} id='menu-item-inbox'>
							({this.state.unreadmessagecount})
						</li>
					</Link>
					<li className='menu-item-separator'></li>
					<li
						id='menu-item-logout'
						className='topbar-item menu-item menu-item-logout'
						onClick={this.handleLogOut}
					></li>
				</ul>
			);
		}

		const credentialModal = this.state.modal.isModalHidden ? null : (
			<CredentialModal
				isRegisterMenuActive={this.state.modal.isRegisterMenuActive}
				isLoginMenuActive={this.state.modal.isLoginMenuActive}
				closeModal={this.closeModal}
				toggleModalMenu={this.toggleModalMenu}
				openDialog={this.props.openDialog}
			/>
		);

		return (
			<div className='topbar-container' id='topbar'>
				<div className='topbar-wrapper'>
					<Link to={{ pathname: '/' }}>{logoArea}</Link>
					<div className='menu-container'>
						{searchArea}
						{menuArea}
					</div>
					{credentialModal}
				</div>
			</div>
		);
	}
}

export default withRouter(
	connect(mapStateToProps, { setUserCredentials })(TopBar)
);
