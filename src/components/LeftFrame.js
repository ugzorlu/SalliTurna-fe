import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
// import AdSense from 'react-adsense'
import isEqual from 'react-fast-compare'
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import tr from 'date-fns/locale/tr'
registerLocale('tr', tr)
setDefaultLocale('tr')
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import localeData from 'dayjs/plugin/localeData'
import 'dayjs/locale/tr'
dayjs.extend(isBetween)
dayjs.extend(localeData)
dayjs.locale('tr')
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})

/* Constants and Helpers */
import { API_DIRECTORY, CLOUDINARY_NAME } from '../utils/constants.js'
import {
    setCookie,
    getCookie,
    getCityName,
    fetchWithErrorHandling,
    bindDocumentEvents,
    unbindDocumentEvents,
    updateState,
    checkElementClicked,
} from '../utils/commons.js'
import { setCity } from '../actions/cityActions'
import { setDialog } from '../actions/dialogActions'
import { setLeftframe, setSearch } from '../actions/navigationActions'

/* Styling */
import 'react-datepicker/dist/react-datepicker.css'
import iconAnglesRight from '../assets/fontawesome/angles-right-solid.svg'
import iconCaretDown from '../assets/fontawesome/caret-down-solid.svg'
import iconCalendarDays from '../assets/fontawesome/calendar-days-solid.svg'
import iconCategory from '../assets/fontawesome/icons-solid.svg'
import iconLocationDot from '../assets/fontawesome/location-dot-solid.svg'
import '../styles/LeftFrame.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        User: state.user,
        City: state.city,
        navigation: state.navigation,
    }
}
const mapDispatchToProps = {
    setCity,
    setDialog,
    setLeftframe,
    setSearch,
}
// Redux functions to connect Redux store end.

class EmbeddedTitleList extends Component {
    constructor(props) {
        super(props)
        this.state = { selectedTopic: null }
    }

    handleSelectTopic = (topicName) => {
        this.setState({ selectedTopic: topicName })
    }

    // Render helper functions begin.
    renderTopic = (title, postCount, path, topicName, url) => {
        const isActive =
            topicName === this.state.selectedTopic && url.includes(path)

        const leftframeTopicWrapperClass = `leftframe-topic-wrapper leftframe-subject-wrapper ${
            isActive ? 'leftframe-topic-wrapper-active' : ''
        }`

        return (
            <div
                className={leftframeTopicWrapperClass}
                onClick={() => this.handleSelectTopic(topicName)}
            >
                <Link to={{ pathname: `/${path}` }}>
                    <div className="leftframe-topic-container">
                        <div className="leftframe-topic">
                            <div className="leftframe-topic-title">{title}</div>
                        </div>
                        <span className="leftframe-topic-postcount">
                            {postCount}
                        </span>
                    </div>
                </Link>
            </div>
        )
    }
    // Render helper functions end.

    render() {
        const url = this.props.location.pathname

        return (
            <div className="leftframe-topiclist">
                {this.renderTopic(
                    'Sanal Müzeler',
                    10,
                    'online-muzeler',
                    'museumlist',
                    url
                )}
                {this.renderTopic(
                    'Kendini İyi Hisset Filmleri',
                    12,
                    'iyi-hisset-filmleri',
                    'movielist',
                    url
                )}
            </div>
        )
    }
}
// Connects component to Redux and exports with React Router.
const RoutedConnectedEmbeddedTitleList = withRouter(
    connect(mapStateToProps)(EmbeddedTitleList)
)

class TitleList extends Component {
    constructor(props) {
        super(props)
        this.state = { selectedTopic: null }
    }

    handleSelectTopic = (topicId) => {
        this.setState({ selectedTopic: topicId })
    }

    // Render helper functions begin.
    renderLoadingSkeleton = () => {
        const { isEventSelected } = this.props

        if (isEventSelected) {
            return Array.from({ length: 5 }).map((_, i) => (
                <div className="leftframe-topic-wrapper" key={i}>
                    <div className="leftframe-event-container">
                        <div className="leftframe-event-skeleton">
                            <div className="leftframe-event-photo-container-skeleton">
                                <div className="leftframe-event-photo-wrapper-skeleton"></div>
                            </div>
                            <div className="leftframe-event-text-container-skeleton">
                                <div className="leftframe-event-date-skeleton"></div>
                                <div className="leftframe-event-title-skeleton"></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
        } else {
            return Array.from({ length: 15 }).map((_, i) => (
                <div className="leftframe-topic-wrapper" key={i}>
                    <div className="leftframe-topic-container">
                        <span className="leftframe-topic-title-skeleton"></span>
                        <span className="leftframe-topic-postcount-skeleton"></span>
                    </div>
                </div>
            ))
        }
    }

    renderTopic = (Topic, url) => {
        const isActive =
            Topic.topic_id === this.state.selectedTopic && url.includes('topic')
        const wrapperClass = `leftframe-topic-wrapper
             ${isActive ? 'leftframe-topic-wrapper-active' : ''} 
             ${
                 Topic.Category.isEvent
                     ? 'leftframe-event-wrapper-active'
                     : 'leftframe-subject-wrapper'
             }`

        const liveIcon = dayjs().isBetween(
            dayjs(Topic.start_date),
            Topic.end_date
                ? dayjs(Topic.end_date)
                : dayjs(Topic.start_date).add(1, 'hour')
        ) && (
            <span className="leftframe-event-live">
                Başladı
                <span className="leftframe-event-live-icon"></span>
            </span>
        )

        const freeIcon = Topic.isFree === 1 && (
            <span className="leftframe-event-free">Ücretsiz</span>
        )

        const myImage = myCloudinary.image(Topic.Posts[0].post_photo)
        myImage.resize(fill().width(75).height(75)).roundCorners(byRadius(5))

        return (
            <div
                className={wrapperClass}
                onClick={() => this.handleSelectTopic(Topic.topic_id)}
                key={Topic.topic_id}
            >
                <Link to={`/topic/${Topic.topic_id}`}>
                    {Topic.Category.isEvent ? (
                        <div className="leftframe-event-container">
                            <div className="leftframe-event">
                                <div className="leftframe-event-photo-container">
                                    <div className="leftframe-event-photo-wrapper">
                                        <AdvancedImage
                                            width="100%"
                                            height="auto"
                                            cldImg={myImage}
                                            alt="Etkinlik"
                                        />
                                    </div>
                                </div>
                                <div className="leftframe-event-text-container">
                                    <div className="leftframe-event-date">
                                        {this.formatEventDate(
                                            Topic.start_date,
                                            Topic.end_date
                                        )}
                                    </div>
                                    <div className="leftframe-event-title">
                                        {Topic.topic_title}
                                    </div>
                                    {liveIcon}
                                    {freeIcon}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="leftframe-topic-container">
                            <div className="leftframe-topic">
                                <div className="leftframe-topic-title">
                                    {Topic.topic_title}
                                </div>
                                <span className="leftframe-topic-postcount">
                                    {Topic.post_count}
                                </span>
                            </div>
                        </div>
                    )}
                </Link>
            </div>

            // {
            //   ((Topic.Category.isEvent === 1 && index % 6 === 2) || (this.props.isTopicSelected && index % 10 === 4))
            //   &&
            //   <div className="leftframe-topic-wrapper">
            //   <div className="leftframe-rekl-container">
            //   <AdSense.Google
            //     className="adsbygoogle"
            //     client='ca-pub-5093736351800898'
            //     slot='9164849165'
            //     layoutKey='-ef+7v-38-dp+10p'
            //     format='fluid'
            //   />
            //   </div>
            //   </div>
            // }
        )
    }
    formatEventDate = (startDate, endDate) => {
        const start = dayjs(startDate)

        if (endDate) {
            const end = dayjs(endDate)

            if (start.format('D MMMM YYYY') === end.format('D MMMM YYYY')) {
                return `${start.format('D MMMM YYYY dddd')} ⋅ ${start.format(
                    'HH:mm'
                )} - ${end.format('HH:mm')}`
            } else if (start.format('MMMM') === end.format('MMMM')) {
                return `${start.format('D')} - ${end.format(
                    'D MMMM YYYY'
                )} ⋅ ${end.format('HH:mm')}`
            } else {
                return `${start.format('D MMMM')} - ${end.format(
                    'D MMMM YYYY'
                )} ⋅ ${start.format('HH:mm')}`
            }
        } else {
            return `${start.format('D MMMM YYYY dddd')} ⋅ ${start.format(
                'HH:mm'
            )}`
        }
    }

    renderTitleListArea = () => {
        const { isDownloading, topics, location } = this.props
        const url = location.pathname

        return isDownloading ? (
            this.renderLoadingSkeleton()
        ) : topics && topics.length > 0 ? (
            topics.map((Topic) => this.renderTopic(Topic, url))
        ) : (
            <div className="leftframe-topic-notfound">Etkinlik bulunamadı.</div>
        )
    }

    renderAddTopicArea = () => {
        const { User: loggedInUser, isEventSelected } = this.props

        return loggedInUser && loggedInUser.id ? (
            <div
                className={`leftframe-topic-wrapper leftframe-addtopic-wrapper ${
                    this.state.selectedTopic === 'addtopic'
                        ? 'leftframe-topic-wrapper-active'
                        : ''
                }`}
                onClick={() => this.handleSelectTopic('addtopic')}
            >
                <Link to="/topic/draft">
                    <div className="leftframe-topic-container">
                        <div className="leftframe-topic">
                            <span className="leftframe-topic-title">
                                {isEventSelected
                                    ? 'Etkinlik Ekle'
                                    : 'Konu Ekle'}
                            </span>
                            <span className="leftframe-topic-postcount">+</span>
                        </div>
                    </div>
                </Link>
            </div>
        ) : null
    }
    // Render helper functions end.

    render() {
        return (
            <div className="leftframe-topics-container">
                <div className="leftframe-topiclist">
                    {this.renderTitleListArea()}
                    {this.renderAddTopicArea()}
                </div>
            </div>
        )
    }
}
// Connects component to Redux and exports with React Router.
const RoutedConnectedTitleList = withRouter(connect(mapStateToProps)(TitleList))

class DropdownCategory extends Component {
    render() {
        const { categoryName, handleChangeCategory } = this.props
        return (
            <div
                className="leftframe-topics-category"
                onClick={() => handleChangeCategory(categoryName)}
            >
                {categoryName}
            </div>
        )
    }
}

class DropdownCity extends Component {
    render() {
        const { cityId, cityName, handleChangeCity } = this.props
        return (
            <div
                className="leftframe-topics-city"
                onClick={() => handleChangeCity(cityId, cityName)}
            >
                {cityName}
            </div>
        )
    }
}

class LeftFrame extends Component {
    constructor(props) {
        super(props)

        // Sets city from the cookie.
        const { setCity } = this.props
        const cityID = getCookie('city') ?? '0'
        const cityName = getCityName(cityID)
        const currentCity = { cityID, cityName }
        setCity(currentCity)

        this.state = {
            topics: [],
            dropdown: {
                isDateDropdownActive: false,
                isCategoryDropdownActive: false,
                isCityDropdownActive: false,
            },
            filter: {
                categoryName: 'Tüm Kategoriler',
                startDate: null,
                endDate: null,
                cityId: cityID,
            },
            pagination: {
                isPaginationActive: false,
                currentPage: 1,
                totalPage: 1,
            },
            isDownloading: false,
        }
        this.leftframeRef = createRef()
        this.leftframeToggleButtonContainerRef = createRef()

        this.dateDropdownRef = createRef()
        this.categoryDropdownRef = createRef()
        this.cityDropdownRef = createRef()

        this.topicRef = createRef()
        this.embeddedTopicRef = createRef()
    }

    componentDidMount() {
        const { User, navigation } = this.props

        if (User.id && User.id !== 0) {
            if (navigation.leftframe.menu.isEventSelected) {
                this.getLatestEvents()
            } else {
                this.getLatestTopics()
            }
        }

        // Binds click events to the document. Optimized for mobile devices.
        // Prevents trigger first time clicks via capture option.
        const dropdowns = [
            { key: 'isDateDropdownActive', ref: this.dateDropdownRef },
            { key: 'isCategoryDropdownActive', ref: this.categoryDropdownRef },
            { key: 'isCityDropdownActive', ref: this.cityDropdownRef },
        ]
        bindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            (e) => {
                dropdowns.forEach(({ key, ref }) => {
                    this.handleClickOutsideDropdown(e, key, ref)
                })
            },
            { capture: true }
        )
    }

    componentWillUnmount() {
        // Unbinds click events from the document. Optimized for mobile devices.
        const dropdowns = [
            { key: 'isDateDropdownActive', ref: this.dateDropdownRef },
            { key: 'isCategoryDropdownActive', ref: this.categoryDropdownRef },
            { key: 'isCityDropdownActive', ref: this.cityDropdownRef },
        ]
        unbindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            (e) => {
                dropdowns.forEach(({ key, ref }) => {
                    this.handleClickOutsideDropdown(e, key, ref)
                })
            },
            { capture: true }
        )
    }

    deepEqual = (obj1, obj2) => {
        // If both are identical (including non-object values), return true
        if (obj1 === obj2) return true

        // If either is not an object or one of them is null, return false
        if (
            typeof obj1 !== 'object' ||
            obj1 === null ||
            typeof obj2 !== 'object' ||
            obj2 === null
        ) {
            return false
        }

        // Get own property keys for each object
        const keys1 = Object.keys(obj1)
        const keys2 = Object.keys(obj2)

        // If objects have different numbers of keys, they’re not equal
        if (keys1.length !== keys2.length) return false

        // Check if all keys and values are equal (recursively for nested objects)
        for (let key of keys1) {
            if (!keys2.includes(key) || !this.deepEqual(obj1[key], obj2[key])) {
                return false
            }
        }

        return true
    }

    componentDidUpdate(prevProps, prevState) {
        const { navigation, User, City } = this.props
        const { filter } = this.state

        // Checks if there is a city change, user login change or navigation change.
        const didPropsChanged =
            !isEqual(User, prevProps.User) ||
            !isEqual(City, prevProps.City) ||
            !isEqual(navigation.leftframe, prevProps.navigation.leftframe) ||
            !isEqual(navigation.search, prevProps.navigation.search)

        // Checks if there is a topic search filter change.
        const didFiltersChanged =
            filter.startDate !== prevState.filter.startDate ||
            filter.endDate !== prevState.filter.endDate ||
            filter.categoryName !== prevState.filter.categoryName

        if (didPropsChanged || didFiltersChanged) {
            this.resetPagination()
            const { isSearchActive, keyword } = navigation.search
            const { isEventSelected } = navigation.leftframe.menu

            if (isSearchActive) {
                this.findTopics(keyword, 1, isEventSelected)
            } else if (isEventSelected) {
                this.getLatestEvents()
            } else {
                this.getLatestTopics()
            }
        }
    }

    // Redirects page with found topic or proposed new topic addition.
    updateTopic = (keyword, topic) => {
        const path = topic
            ? `/topic/${topic.topic_id}`
            : `/topic/draft?title=${encodeURIComponent(
                  keyword
              )}&redirected=true`

        this.props.history.push(path)
    }
    findTopics = async (keyword, targetPage, isEvent) => {
        const { setDialog, City, setSearch } = this.props

        // Returns early if no keyword is provided.
        if (!keyword) return

        try {
            // Shows user a loading animation.
            this.setState({ isDownloading: true })

            // Fills fetch parameters.
            const url = `${API_DIRECTORY}/findTopics`
            const body = JSON.stringify({
                city_id: City.cityID,
                topic_search_keyword: keyword,
                targetpagenumber: targetPage,
                eventsonly: isEvent,
            })

            const responseFindTopics = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body,
            })
            const { status, message, TopicList, totaltopiccount, Topic } =
                responseFindTopics

            if (status === 'success') {
                this.setState({ topics: TopicList })

                if (totaltopiccount > 10)
                    updateState(this, 'pagination', {
                        isPaginationActive: true,
                        totalPage: Math.ceil(totaltopiccount / 10),
                    })
                else {
                    updateState(this, 'pagination', {
                        isPaginationActive: false,
                        currentPage: 1,
                        totalPage: 1,
                    })
                }

                // If exact topic is found, route page to that topic and clear the search.
                // Otherwise, route to topic draft page with given search inputs and result.
                this.updateTopic(keyword, Topic)
                if (Topic) {
                    setSearch({ isSearchActive: false, keyword: '' })
                }
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status,
                    message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            // Removes the loading animation from the page.
            this.setState({ isDownloading: false })
        }
    }

    getLatestEvents = async (targetPage) => {
        const { setDialog, City } = this.props
        const { startDate, endDate, categoryName } = this.state.filter

        try {
            this.setState({ isDownloading: true })

            const url = `${API_DIRECTORY}/getLatestEvents`
            const body = JSON.stringify({
                start_date: startDate,
                end_date: endDate,
                category_name: categoryName,
                city_id: City.cityID,
                targetpagenumber: targetPage ?? 1,
            })

            const responseLatestTopics = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body,
            })
            if (responseLatestTopics.status === 'success') {
                this.setState({ topics: responseLatestTopics.TopicList })

                if (responseLatestTopics.totaltopiccount > 6) {
                    updateState(this, 'pagination', {
                        isPaginationActive: true,
                        totalPage: Math.ceil(
                            responseLatestTopics.totaltopiccount / 6
                        ),
                    })
                } else {
                    this.resetPagination()
                }
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseLatestTopics.status,
                    message: responseLatestTopics.message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            // Removes the loading animation from the page.
            this.setState({ isDownloading: false })
        }
    }

    getLatestTopics = async (targetPage) => {
        const { setDialog } = this.props

        try {
            // Shows user a loading animation.
            this.setState({ isDownloading: true })

            // Fills fetch parameters.
            const url = `${API_DIRECTORY}/getLatestTopics`
            const body = JSON.stringify({
                targetpagenumber: targetPage ?? 1,
            })

            const responseLatestTopics = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body,
            })
            if (responseLatestTopics.status === 'success') {
                this.setState({ topics: responseLatestTopics.TopicList })

                if (responseLatestTopics.totaltopiccount > 10)
                    updateState(this, 'pagination', {
                        isPaginationActive: true,
                        totalPage: Math.ceil(
                            responseLatestTopics.totaltopiccount / 10
                        ),
                    })
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseLatestTopics.status,
                    message: responseLatestTopics.message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            // Removes the loading animation from the page.
            this.setState({ isDownloading: false })
        }
    }

    resetPagination = () => {
        updateState(this, 'pagination', {
            isPaginationActive: false,
            currentPage: 1,
            totalPage: 1,
        })
    }

    handleClickCloseSearch = () => {
        const { setSearch } = this.props
        setSearch({ isSearchActive: false, keyword: '' })
    }

    handleClickDateDropdown = (e) => {
        // Does nothing if click is on dropdown calendar i.e. popper.
        const popper = document.querySelector(
            '.leftframe-topics-dateinfo-popper'
        )
        const days = document.querySelectorAll('.react-datepicker__day')
        const isPopperClicked = popper?.contains(e.target)
        const isDayClicked = Array.from(days).some((day) =>
            day?.contains(e.target)
        )
        if (isPopperClicked && !isDayClicked) {
            return
        }

        // Does nothing if click is on close icon.
        const closeicon = document.querySelector(
            '.leftframe-topics-dateinfo-close-icon'
        )
        const isCloseiconClicked = closeicon?.contains(e.target)
        if (isCloseiconClicked) {
            return
        }

        // Toggles dropdown calendar.
        const { isDateDropdownActive } = this.state.dropdown
        updateState(this, 'dropdown', {
            isDateDropdownActive: !isDateDropdownActive,
        })
    }
    handleChangeDate = (selectedDate, e) => {
        const { startDate } = this.state.filter

        // Clears date when close icon is clicked.
        const closeicon = document.querySelector(
            '.leftframe-topics-dateinfo-close-icon'
        )
        const isCloseiconClicked = closeicon?.contains(e.target)
        if (isCloseiconClicked) {
            updateState(this, 'filter', {
                startDate: null,
                endDate: null,
            })
            return
        }

        // Sets start date. If start date already setted set as end date.
        const dateKey = startDate ? 'endDate' : 'startDate'
        updateState(this, 'filter', {
            [dateKey]: selectedDate,
        })
    }

    handleClickCategoryDropdown = () => {
        const { isCategoryDropdownActive } = this.state.dropdown

        updateState(this, 'dropdown', {
            isCategoryDropdownActive: !isCategoryDropdownActive,
        })
    }
    handleChangeCategory = (categoryName) => {
        updateState(this, 'filter', {
            categoryName: categoryName,
        })
        this.resetPagination()
    }

    handleClickCityDropdown = () => {
        const { isCityDropdownActive } = this.state.dropdown

        updateState(this, 'dropdown', {
            isCityDropdownActive: !isCityDropdownActive,
        })
    }
    handleChangeCity = (cityID, cityName) => {
        const { setCity, User } = this.props

        updateState(this, 'filter', {
            cityId: cityID,
        })
        this.resetPagination()
        const currentCity = { cityID, cityName }
        setCity(currentCity)
        if (User.isCookieAccepted) {
            setCookie('city', currentCity.cityID, 365)
        }
    }

    handleClickOutsideDropdown = (e, dropdownKey, dropdownRef) => {
        const dropdownActive = this.state.dropdown[dropdownKey]
        const dropdownElement = dropdownRef?.current

        // Checks if the dropdown is active and if the click occurred outside.
        if (
            dropdownActive &&
            dropdownElement &&
            !dropdownElement.contains(e.target)
        ) {
            updateState(this, 'dropdown', { [dropdownKey]: false })
        }
    }

    handleClickMenu = (isEvent) => {
        this.resetPagination()

        const { navigation, setLeftframe } = this.props
        const { isSearchActive, keyword } = navigation.search

        if (isSearchActive) {
            this.findTopics(keyword, 1, isEvent)
        } else {
            if (isEvent) {
                this.getLatestEvents()
            } else {
                this.getLatestTopics()
            }
        }
        setLeftframe({
            ...navigation.leftframe,
            menu: {
                isEventSelected: isEvent ? true : false,
                isTopicSelected: isEvent ? false : true,
            },
        })
    }

    handleChangePage = (newPage) => {
        // Ensures the new page is within valid range.
        const { totalPage } = this.state.pagination
        if (newPage < 1 || newPage > totalPage) return

        // Updates the pagination state with the new page.
        updateState(this, 'pagination', {
            currentPage: newPage,
        })

        // Determines the action based on search and event props.
        const { navigation } = this.props
        const { isSearchActive, keyword } = navigation.search
        const { isEventSelected } = navigation.leftframe.menu

        if (isSearchActive) {
            this.findTopics(keyword, newPage, isEventSelected)
        } else if (isEventSelected) {
            this.getLatestEvents(newPage)
        } else {
            this.getLatestTopics(newPage)
        }
    }
    handleClickPreviousPage = () => {
        const { currentPage } = this.state.pagination
        this.handleChangePage(currentPage - 1)
    }
    handleClickNextPage = () => {
        const { currentPage } = this.state.pagination
        this.handleChangePage(currentPage + 1)
    }
    handleClickCustomPage = (e) => {
        const customPage = parseInt(e.target.value, 10)
        if (!isNaN(customPage)) {
            this.handleChangePage(customPage)
        }
    }
    handleClickFinalPage = () => {
        const { totalPage } = this.state.pagination
        this.handleChangePage(totalPage)
    }

    handleMobileLeftFrame = (e) => {
        const {
            props,
            leftframeRef,
            leftframeToggleButtonContainerRef,
            topicRef,
            embeddedTopicRef,
        } = this

        const { navigation, setLeftframe } = props
        const { isMobileActive } = navigation.leftframe
        const { target } = e

        const isLeftframeClicked = checkElementClicked(leftframeRef, target)
        const isLeftframeToggleButtonClicked = checkElementClicked(
            leftframeToggleButtonContainerRef,
            target
        )
        const isTopicClicked = checkElementClicked(topicRef, target)
        const isEmbeddedTopicClicked = checkElementClicked(
            embeddedTopicRef,
            target
        )

        if (isLeftframeClicked) {
            if (isLeftframeToggleButtonClicked) {
                setLeftframe({
                    ...navigation.leftframe,
                    isMobileActive: !isMobileActive,
                })
            } else if (isTopicClicked || isEmbeddedTopicClicked) {
                setLeftframe({
                    ...navigation.leftframe,
                    isMobileActive: false,
                })
            }
        } else {
            setLeftframe({
                ...navigation.leftframe,
                isMobileActive: false,
            })
        }
    }

    // Render helper functions begin.
    renderDescribeArea = () => {
        const { navigation } = this.props
        const { menu } = navigation.leftframe
        const { isEventSelected, isTopicSelected } = menu
        const { isSearchActive, keyword } = navigation.search
        const { topics } = this.state

        const categoryEventClass = `category ${
            isEventSelected ? 'category-active' : ''
        }`
        const categoryTopicClass = `category ${
            isTopicSelected ? 'category-active' : ''
        }`

        if (isSearchActive) {
            return (
                <div className="leftframe-search-container">
                    <div className="leftframe-search">
                        <span className="leftframe-search-text">
                            {`${keyword} Hakkında Arama Sonuçları`}
                        </span>
                        <span
                            className="leftframe-search-close"
                            onClick={this.handleClickCloseSearch}
                        ></span>
                    </div>
                    {topics.length === 0 && (
                        <span className="leftframe-search-notfound">
                            Aradığınız kriterlere uygun sonuç bulunamadı.
                        </span>
                    )}
                </div>
            )
        } else {
            return (
                <div className="leftframe-categories-container">
                    <div className="categories">
                        <div
                            className={categoryEventClass}
                            onClick={() => this.handleClickMenu(true)}
                        >
                            ETKİNLİKLER
                        </div>
                        <div
                            className={categoryTopicClass}
                            onClick={() => this.handleClickMenu(false)}
                        >
                            KONULAR
                        </div>
                    </div>
                </div>
            )
        }
    }

    renderFiltersArea = () => {
        const { isEventSelected } = this.props.navigation.leftframe.menu
        const { startDate, endDate, categoryName } = this.state.filter
        const {
            isDateDropdownActive,
            isCategoryDropdownActive,
            isCityDropdownActive,
        } = this.state.dropdown
        const { City } = this.props

        if (!isEventSelected) return null

        return (
            <div className="leftframe-filters-container">
                <div
                    className="leftframe-topics-dateinfo-container"
                    ref={this.dateDropdownRef}
                    style={{ display: isEventSelected ? 'flex' : 'none' }}
                >
                    <div className="leftframe-topics-dateinfo-icon-wrapper">
                        <img
                            className="leftframe-topics-dateinfo-icon"
                            src={iconCalendarDays}
                            alt={iconCalendarDays}
                        />
                    </div>
                    <div className="leftframe-topics-dateinfo-wrapper">
                        <div onClick={this.handleClickDateDropdown}>
                            <DatePicker
                                open={isDateDropdownActive}
                                selected={startDate}
                                startDate={startDate}
                                endDate={endDate}
                                selectsEnd={Boolean(startDate)}
                                minDate={startDate}
                                dateFormat="d MMMM yyyy"
                                isClearable={true}
                                clearButtonClassName="leftframe-topics-dateinfo-close-icon"
                                onChange={this.handleChangeDate}
                                popperClassName="leftframe-topics-dateinfo-popper"
                                customInput={
                                    startDate ? (
                                        <span className="leftframe-topics-dateinfo-text">
                                            {endDate
                                                ? `${dayjs(startDate).format(
                                                      'D MMMM YYYY'
                                                  )} – ${dayjs(endDate).format(
                                                      'D MMMM YYYY'
                                                  )}`
                                                : dayjs(startDate).format(
                                                      'D MMMM YYYY'
                                                  )}
                                        </span>
                                    ) : (
                                        <span>Tüm Tarihler</span>
                                    )
                                }
                            />
                        </div>
                        <div className="leftframe-topics-dateinfo-dropdownicon-container">
                            <img
                                className="leftframe-topics-dateinfo-dropdownicon"
                                src={iconCaretDown}
                                alt={iconCaretDown}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="leftframe-topics-categoryinfo-container"
                    ref={this.categoryDropdownRef}
                    style={{ display: isEventSelected ? 'flex' : 'none' }}
                >
                    <div className="leftframe-topics-categoryinfo-icon-wrapper">
                        <img
                            className="leftframe-topics-categoryinfo-icon"
                            src={iconCategory}
                            alt={iconCategory}
                        />
                    </div>
                    <div className="leftframe-topics-categoryinfo-wrapper">
                        <div
                            className="leftframe-topics-categoryinfo"
                            onClick={this.handleClickCategoryDropdown}
                        >
                            <div className="leftframe-topics-categoryinfo-dropdown-selected">
                                <div className="leftframe-topics-category-selected">
                                    {categoryName}
                                </div>
                            </div>
                            <div
                                className="leftframe-topics-categoryinfo-dropdown"
                                style={{
                                    display: isCategoryDropdownActive
                                        ? 'block'
                                        : 'none',
                                }}
                            >
                                {[
                                    'Tüm Kategoriler',
                                    'Konser',
                                    'Sahne / Sergi / Sinema',
                                    'Eğitim / Söyleşi / Sohbet',
                                    'Gösteri',
                                ].map((name) => (
                                    <DropdownCategory
                                        key={name}
                                        categoryName={name}
                                        handleChangeCategory={
                                            this.handleChangeCategory
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="leftframe-topics-categoryinfo-dropdownicon-container">
                            <img
                                className="leftframe-topics-categoryinfo-dropdownicon"
                                src={iconCaretDown}
                                alt={iconCaretDown}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="leftframe-topics-cityinfo-container"
                    ref={this.cityDropdownRef}
                    style={{ display: isEventSelected ? 'flex' : 'none' }}
                >
                    <div className="leftframe-topics-cityinfo-icon-wrapper">
                        <img
                            className="leftframe-topics-cityinfo-icon"
                            src={iconLocationDot}
                            alt={iconLocationDot}
                        />
                    </div>
                    <div className="leftframe-topics-cityinfo-wrapper">
                        <div
                            className="leftframe-topics-cityinfo"
                            onClick={this.handleClickCityDropdown}
                        >
                            <div className="leftframe-topics-cityinfo-dropdown-selected">
                                <div className="leftframe-topics-city-selected">
                                    {City.cityName}
                                </div>
                            </div>
                            <div
                                className="leftframe-topics-cityinfo-dropdown"
                                style={{
                                    display: isCityDropdownActive
                                        ? 'block'
                                        : 'none',
                                }}
                            >
                                {[
                                    { cityID: '0', cityName: 'Tüm Türkiye' },
                                    { cityID: '34', cityName: 'İstanbul' },
                                    { cityID: '35', cityName: 'İzmir' },
                                    { cityID: '6', cityName: 'Ankara' },
                                    { cityID: '82', cityName: 'Online' },
                                ].map((city) => (
                                    <DropdownCity
                                        key={city.cityID}
                                        cityId={city.cityID}
                                        cityName={city.cityName}
                                        handleChangeCity={this.handleChangeCity}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="leftframe-topics-cityinfo-dropdownicon-container">
                            <img
                                className="leftframe-topics-cityinfo-dropdownicon"
                                src={iconCaretDown}
                                alt={iconCaretDown}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderEmbeddedArea = () => {
        const { isTopicSelected } = this.props.navigation.leftframe.menu

        if (!isTopicSelected) return null

        return (
            <>
                <div className="leftframe-topics-title">Derlemeler</div>
                <div
                    className="leftframe-topics-container"
                    ref={this.embeddedTopicRef}
                >
                    <RoutedConnectedEmbeddedTitleList />
                </div>
                <div className="leftframe-topics-title">Gönderiler</div>
            </>
        )
    }

    renderPagingArea = () => {
        const { isPaginationActive, currentPage, totalPage } =
            this.state.pagination

        if (!isPaginationActive) return null

        return (
            <div className="leftframe-paging-container">
                <div className="leftframe-paging">
                    <div
                        className="leftframe-paging-page leftframe-paging-previouspage"
                        onClick={this.handleClickPreviousPage}
                    >
                        &#8249;
                    </div>

                    <div className="leftframe-paging-currentpage-container">
                        <select
                            className="leftframe-paging-currentpage"
                            value={currentPage}
                            onChange={this.handleClickCustomPage}
                        >
                            {[...Array(totalPage)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <div className="leftframe-paging-currentpage-icon-container">
                            <img
                                className="leftframe-paging-currentpage-icon"
                                src={iconCaretDown}
                                alt={iconCaretDown}
                            />
                        </div>
                    </div>

                    <div className="leftframe-paging-page-seperator">/</div>
                    <div
                        className="leftframe-paging-page leftframe-paging-finalpage"
                        onClick={this.handleClickFinalPage}
                    >
                        {totalPage}
                    </div>

                    <div
                        className="leftframe-paging-page leftframe-paging-nextpage"
                        onClick={this.handleClickNextPage}
                    >
                        &#8250;
                    </div>
                </div>
            </div>
        )
    }
    // Render helper functions end.

    render() {
        const { isMobileActive } = this.props.navigation.leftframe

        const leftframeContainerClass = `leftframe-container ${
            isMobileActive ? 'leftframe-container-active' : ''
        }`
        const leftframeClass = `leftframe ${
            isMobileActive ? 'leftframe-active' : ''
        }`

        return (
            <div
                className={leftframeContainerClass}
                onClick={this.handleMobileLeftFrame}
            >
                <div className={leftframeClass} ref={this.leftframeRef}>
                    {this.renderDescribeArea()}
                    {this.renderFiltersArea()}
                    {this.renderEmbeddedArea()}
                    {this.renderPagingArea()}
                    <div ref={this.topicRef}>
                        <RoutedConnectedTitleList
                            topics={this.state.topics}
                            isEventSelected={
                                this.props.navigation.leftframe.menu
                                    .isEventSelected
                            }
                            isTopicSelected={
                                this.props.navigation.leftframe.menu
                                    .isTopicSelected
                            }
                            isDownloading={this.state.isDownloading}
                        />
                    </div>
                    {this.renderPagingArea()}
                    <div
                        className="leftframe-toggle-button-container"
                        ref={this.leftframeToggleButtonContainerRef}
                    >
                        <div className="leftframe-toggle-button-wrapper">
                            <img
                                className="leftframe-toggle-button"
                                src={iconAnglesRight}
                                alt={iconAnglesRight}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// Connects component to Redux.
const ConnectedLeftFrame = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeftFrame)

// Exports component with React Router.
export default withRouter(ConnectedLeftFrame)
