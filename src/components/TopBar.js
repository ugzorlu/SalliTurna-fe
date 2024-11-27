import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import isEqual from 'react-fast-compare'

/* Internal Components */
import CredentialModal from './CredentialModal.js'

/* Constants and Helpers */
import { API_DIRECTORY } from '../utils/constants.js'
import {
    updateState,
    combineClassnames,
    fetchWithErrorHandling,
    bindDocumentEvents,
    unbindDocumentEvents,
} from '../utils/commons'
import { setUser } from '../actions/userActions'
import { setDialog } from '../actions/dialogActions'
import {
    setLeftframe,
    setTopbar,
    setSearch,
} from '../actions/navigationActions'

/* Styling */
import iconAlignJustify from '../assets/fontawesome/align-justify-solid.svg'
import '../styles/TopBar.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        User: state.user,
        navigation: state.navigation,
    }
}
const mapDispatchToProps = {
    setUser,
    setDialog,
    setLeftframe,
    setTopbar,
    setSearch,
}
// Redux functions to connect Redux store end.

class TopBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            search: {
                isSearchDropdownActive: false,
                isMobileSearchActive: false,
                keyword: this.props.navigation.search.keyword,
                topics: [],
            },
        }

        this.dropdownSearchRef = createRef()
        this.containerSearchRef = createRef()
        this.searchInputRef = createRef()
    }

    componentDidMount() {
        // Binds click events to the document. Optimized for mobile devices.
        // Informs the browser that the event listener won’t block scrolling via passive option.
        bindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideSearchArea,
            { passive: true }
        )
    }

    componentWillUnmount() {
        // Unbinds click events from the document. Optimized for mobile devices.
        unbindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideSearchArea,
            { passive: true }
        )
    }

    componentDidUpdate(prevProps) {
        const { User, navigation } = this.props

        // Checks if there is a user login change or navigation change.
        const didPropsChanged =
            !isEqual(User, prevProps.User) ||
            !isEqual(navigation.topbar, prevProps.navigation.topbar)

        if (didPropsChanged) {
            this.resetSearchBar()
        }
    }

    handleClickOutsideSearchArea = (e) => {
        // Checks if the click/touch is outside the search areas.
        const isOutsideDropdownSearch =
            !this.dropdownSearchRef?.current?.contains(e.target)
        const isOutsideContainerSearch =
            !this.containerSearchRef?.current?.contains(e.target)

        // Hides the search dropdown and deactivates mobile search.
        if (isOutsideDropdownSearch && isOutsideContainerSearch) {
            this.resetSearchBar()
        }
    }

    openModalWithMenu = (mode) => {
        const { setTopbar } = this.props

        switch (mode) {
            case 'register':
                setTopbar({
                    isModalActive: true,
                    menu: {
                        isRegisterMenuSelected: true,
                        isLoginMenuSelected: false,
                    },
                })
                break
            case 'login':
                setTopbar({
                    isModalActive: true,
                    menu: {
                        isRegisterMenuSelected: false,
                        isLoginMenuSelected: true,
                    },
                })
                break
        }
    }

    closeModal = () => {
        const { setTopbar } = this.props

        setTopbar({
            isModalActive: false,
            menu: {
                isLoginMenuSelected: false,
                isRegisterMenuSelected: false,
            },
        })
    }

    toggleModalMenu = (mode) => {
        const { navigation, setTopbar } = this.props

        switch (mode) {
            case 'register':
                setTopbar({
                    ...navigation.topbar,
                    menu: {
                        isLoginMenuSelected: false,
                        isRegisterMenuSelected: true,
                    },
                })
                break
            case 'login':
                setTopbar({
                    ...navigation.topbar,
                    menu: {
                        isLoginMenuSelected: true,
                        isRegisterMenuSelected: false,
                    },
                })
                break
        }
    }

    resetSearchBar = () => {
        const { keyword } = this.props.navigation.search

        updateState(this, 'search', {
            isSearchDropdownActive: false,
            isMobileSearchActive: false,
            keyword,
            topics: [],
        })
    }

    getSmartSearchGuess = async (keyword) => {
        const { setDialog } = this.props

        try {
            const body = JSON.stringify({
                topic_search_keyword: keyword,
            })
            const responseGetSmartSearchFound = await fetchWithErrorHandling(
                `${API_DIRECTORY}/getSmartSearchGuess`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body,
                }
            )
            if (responseGetSmartSearchFound.status === 'success') {
                updateState(this, 'search', {
                    topics: responseGetSmartSearchFound.TopicList,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }

    handleRouteFoundTopic = (e) => {
        const topicId = e.currentTarget.dataset.topicid
        updateState(this, 'search', {
            isSearchDropdownActive: false,
        })
        this.props.history.push(`/topic/${topicId}`)
    }

    handleChangeSearchBar = () => {
        const keyword = this.searchInputRef.current.value
        updateState(this, 'search', {
            isSearchDropdownActive: true,
            keyword,
        })
        this.getSmartSearchGuess(keyword)
    }

    handleClearSearchBar = () => {
        const { navigation, setSearch } = this.props

        updateState(this, 'search', {
            isSearchDropdownActive: false,
            keyword: '',
            topics: [],
        })
        setSearch({
            ...navigation.search,
            keyword: '',
        })
        this.searchInputRef.current.focus()
    }

    handleClickSearchButton = () => {
        const { setDialog, setSearch, setLeftframe, navigation } = this.props

        const keyword = this.searchInputRef.current.value
        if (keyword === null || keyword === '') {
            setDialog({
                isDialogActive: true,
                status: 'info',
                message: 'Arama alanına kelime girişi yapmadınız.',
            })
        } else {
            setSearch({
                ...navigation.search,
                isSearchActive: true,
                keyword,
            })
            setLeftframe({
                ...navigation.leftframe,
                isMobileActive: true,
            })
        }
    }

    handleMobileSearch = () => {
        const { isMobileSearchActive } = this.state.search

        if (!isMobileSearchActive) {
            updateState(this, 'search', { isMobileSearchActive: true })
        }
        this.searchInputRef.current.focus()
    }

    handleMobileLeftFrame = () => {
        const { navigation, setLeftframe } = this.props
        setLeftframe({ ...navigation.leftframe, isMobileActive: true })
    }

    handleLogOut = async () => {
        const { setDialog, setUser } = this.props

        try {
            const responseLogout = await fetchWithErrorHandling(
                `${API_DIRECTORY}/logOut`,
                {
                    credentials: 'include',
                }
            )
            if (responseLogout.status === 'success') {
                const defaultUser = {
                    id: 0,
                    username: '',
                    unreadmessagecount: 0,
                }
                setUser(defaultUser)
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseLogout.status,
                    message: responseLogout.message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }

    // Render helper functions begin.
    renderLogo = () => {
        return (
            <Link to={{ pathname: '/' }} aria-label="Şallı Turna - Anasayfa">
                <div className="logo-container">
                    <div className="logo"></div>
                    <div className="textlogo"></div>
                </div>
            </Link>
        )
    }

    renderSearch = () => {
        const {
            isMobileSearchActive,
            isSearchDropdownActive,
            keyword,
            topics,
        } = this.state.search

        const mainSearchContainerClasses = combineClassnames(
            'topbar-item main-search-container',
            'main-search-container-active',
            isMobileSearchActive
        )
        const searchContainerClasses = combineClassnames(
            'search-container',
            'search-container-active',
            isMobileSearchActive
        )
        const searchTopClasses = combineClassnames(
            'search-top',
            'search-top-active',
            isMobileSearchActive
        )
        const searchTopMobileWrapperClasses = combineClassnames(
            'search-top-mobile-wrapper',
            'search-top-mobile-wrapper-active',
            isMobileSearchActive
        )
        const searchTopMobileClasses = combineClassnames(
            'search-top-mobile',
            'search-top-mobile-active',
            isMobileSearchActive
        )
        const searchClearClasses = combineClassnames(
            'search-clear',
            'search-clear-active',
            isMobileSearchActive
        )
        const searchDropdownClasses = combineClassnames(
            'search-dropdown',
            'search-dropdown-active',
            isMobileSearchActive
        )
        const btnSearchClasses = combineClassnames(
            'btn-search',
            'btn-search-active',
            isMobileSearchActive
        )
        return (
            <>
                <div
                    className={mainSearchContainerClasses}
                    ref={this.containerSearchRef}
                >
                    <div className={searchContainerClasses}>
                        <input
                            ref={this.searchInputRef}
                            value={keyword}
                            onChange={this.handleChangeSearchBar}
                            type="text"
                            className={searchTopClasses}
                            autoComplete="off"
                            placeholder="Etkinlik ya da konu ara..."
                        />
                        <div
                            className={searchTopMobileWrapperClasses}
                            onClick={this.handleMobileSearch}
                        ></div>
                        {keyword.length > 0 && (
                            <span
                                className={searchClearClasses}
                                onClick={this.handleClearSearchBar}
                            >
                                ✖
                            </span>
                        )}
                    </div>
                    <div
                        className={btnSearchClasses}
                        onClick={this.handleClickSearchButton}
                    >
                        Ara
                    </div>
                    <div
                        className={searchDropdownClasses}
                        ref={this.dropdownSearchRef}
                        style={{
                            display: isSearchDropdownActive
                                ? 'inline-block'
                                : 'none',
                        }}
                    >
                        {topics?.map((Topic) => (
                            <div
                                className="search-dropdown-topic-wrapper"
                                onClick={this.handleRouteFoundTopic}
                                data-topicid={Topic.topic_id}
                                key={Topic.topic_id}
                            >
                                <span className="search-dropdown-topic-title">
                                    {Topic.topic_title}
                                </span>
                                <span className="search-dropdown-topic-categoryname">
                                    ({Topic.Category.category_name})
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="topbar-item topbar-toggleleftframe-container"
                    onClick={this.handleMobileLeftFrame}
                >
                    <img
                        className="topbar-toggleleftframe-icon"
                        src={iconAlignJustify}
                        alt={iconAlignJustify}
                    />
                </div>
            </>
        )
    }

    renderMenu = () => {
        const { User: userLoggedin } = this.props

        // Renders a guest menu if user not logged in.
        if (
            !userLoggedin ||
            typeof userLoggedin.id !== 'number' ||
            userLoggedin.id <= 0
        ) {
            return (
                <ul className="menu-nav">
                    <li
                        className="topbar-item menu-item menu-item-register"
                        onClick={() => this.openModalWithMenu('register')}
                    ></li>
                    <li className="menu-item-separator"></li>
                    <li
                        className="topbar-item menu-item menu-item-login"
                        onClick={() => this.openModalWithMenu('login')}
                    ></li>
                </ul>
            )
        }

        // Renders user menu if user logged in.
        const menuItemInboxClasses = combineClassnames(
            'topbar-item menu-item menu-item-inbox',
            'menu-item-inbox-unread',
            userLoggedin.unreadmessagecount > 0
        )
        return (
            <ul className="menu-nav">
                <Link to={`/profile/${userLoggedin.id}`}>
                    <li className="topbar-item menu-item menu-item-myaccount">
                        {userLoggedin.username.toUpperCase()}
                    </li>
                </Link>
                <li className="menu-item-separator"></li>
                <Link to="/inbox">
                    <li className={menuItemInboxClasses}>
                        ({userLoggedin.unreadmessagecount})
                    </li>
                </Link>
                <li className="menu-item-separator"></li>
                <li
                    className="topbar-item menu-item menu-item-logout"
                    onClick={this.handleLogOut}
                ></li>
            </ul>
        )
    }

    renderCredentialModal = () => {
        const { topbar } = this.props.navigation

        // Ensures modal state exists and validate its structure.
        if (!topbar || typeof topbar.isModalActive !== 'boolean') return null
        if (!topbar.isModalActive) return null

        // Renders credential modal with correspondent option (register/login).
        return (
            <CredentialModal
                isRegisterMenuSelected={topbar.menu.isRegisterMenuSelected}
                isLoginMenuSelected={topbar.menu.isLoginMenuSelected}
                closeModal={this.closeModal}
                toggleModalMenu={this.toggleModalMenu}
            />
        )
    }
    // Render helper functions end.

    render() {
        return (
            <div className="topbar-container">
                <div className="topbar-wrapper">
                    {this.renderLogo()}
                    <div className="menu-container">
                        {this.renderSearch()}
                        {this.renderMenu()}
                    </div>
                    {this.renderCredentialModal()}
                </div>
            </div>
        )
    }
}

// Connects component to Redux.
const ConnectedTopBar = connect(mapStateToProps, mapDispatchToProps)(TopBar)

// Exports component with React Router.
export default withRouter(ConnectedTopBar)
