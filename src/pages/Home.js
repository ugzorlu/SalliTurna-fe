import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
// import AdSense from 'react-adsense'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})
import isEqual from 'react-fast-compare'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
dayjs.locale('tr')

/* Internal Components */
import SinglePost from '../components/SinglePost.js'

/* Constants and Helpers */
import { API_DIRECTORY, CLOUDINARY_NAME } from '../utils/constants.js'
import {
    getCookie,
    getCityName,
    updateState,
    checkUserLoggedinStatus,
    fetchWithErrorHandling,
} from '../utils/commons.js'
import { setCity } from '../actions/cityActions'
import { setLeftframe, setTopbar } from '../actions/navigationActions'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import iconAngleUp from '../assets/fontawesome/angle-up-solid.svg'
import iconAngleDown from '../assets/fontawesome/angle-down-solid.svg'
import iconShareNodes from '../assets/fontawesome/share-nodes-solid.svg'
import iconMapLocationDot from '../assets/fontawesome/map-location-dot-solid.svg'
import iconCalendarDays from '../assets/fontawesome/calendar-days-solid.svg'
import iconClock from '../assets/fontawesome/clock-solid.svg'
import '../styles/Home.scss'
import '../styles/Topic.scss'
import '../styles/SinglePost.scss'

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
    setLeftframe,
    setTopbar,
    setDialog,
}
// Redux functions to connect Redux store end.

class EventCard extends Component {
    // Render helper functions begin.
    // renderAdsense = () => {
    //     if (this.props.index % 5 !== 3) return null

    //     return (
    //         <div className="rekl-container">
    //             <AdSense.Google
    //                 className="adsbygoogle"
    //                 client="ca-pub-5093736351800898"
    //                 slot="5013158262"
    //                 layout="in-article"
    //                 format="fluid"
    //             />
    //         </div>
    //     )
    // }
    renderVenue = () => {
        const { topic } = this.props
        if (!topic.Venue) return null

        return (
            <span className="topic-venue-wrapper">
                <img
                    className="topic-venue-icon"
                    src={iconMapLocationDot}
                    alt={iconMapLocationDot}
                />
                <span className="topic-venue">{topic.Venue.venue_title}</span>
            </span>
        )
    }
    renderDate = () => {
        const { topic } = this.props
        if (!topic.start_date) return null

        const startDate = dayjs(topic.start_date)
        const endDate = topic.end_date ? dayjs(topic.end_date) : null
        const topicDateFormat = endDate
            ? `${startDate.format('D')} - ${endDate.format('D MMMM YYYY')}`
            : startDate.format('D MMMM YYYY dddd')

        return (
            <span className="topic-time-wrapper">
                <span className="topic-date-wrapper">
                    <img
                        className="topic-date-icon"
                        src={iconCalendarDays}
                        alt={iconCalendarDays}
                    />
                    <span className="topic-date">{topicDateFormat}</span>
                </span>
                <span className="topic-clock-wrapper">
                    <img
                        className="topic-clock-icon"
                        src={iconClock}
                        alt={iconClock}
                    />
                    <span className="topic-clock">
                        {dayjs(topic.start_date).format('HH:mm')}
                    </span>
                </span>
            </span>
        )
    }
    renderInfo = () => {
        return (
            <div className="topic-info-container">
                {this.renderVenue()}
                {this.renderDate()}
            </div>
        )
    }
    renderAttendance = () => {
        const { topic } = this.props
        const post = topic.Posts[0]

        if (post.totalAttendance <= 0) return null

        return (
            <div className="topic-topbar-container home-upcomingevent-topic-topbar-topicinfo-container">
                <div className="home-upcomingevent-topic-topbar home-upcomingevent-topic-topbar-topicinfo">
                    <div className="home-upcomingevent-topic-attendance-container">
                        <div className="home-upcomingevent-topic-attendance-count">
                            {post.totalAttendance}
                        </div>
                        <div className="home-upcomingevent-topic-attendance-count-text">
                            &nbsp;Şallı Turna kullanıcısı katılacak
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderPhoto = () => {
        const { topic } = this.props
        const post = topic.Posts[0]

        if (!post.post_photo) return null

        const myImage = myCloudinary.image(post.post_photo)

        return (
            <div className="home-photo-wrapper">
                <AdvancedImage
                    width="100%"
                    height="auto"
                    cldImg={myImage}
                    alt="Post Foto"
                />
            </div>
        )
    }
    renderSourceLink = () => {
        const { topic } = this.props
        if (topic.source_link === null) return null

        return (
            <a href={topic.source_link} target="_blank" rel="noreferrer">
                <div className="topic-source-link">
                    <div className="topic-source-link-text">
                        {topic.isFree ? 'Bilgi Al' : 'Bilet Al'}
                    </div>
                </div>
            </a>
        )
    }
    // Render helper functions end.

    render() {
        const { topic } = this.props

        return (
            <div className="home-upcomingevents-event-container">
                {/* {this.renderAdsense()} */}
                <Link to={{ pathname: '/topic/' + topic.topic_id }}>
                    <div className="topic-title-container">
                        <div className="home-topic-title-wrapper">
                            <div className="home-topic-title">
                                {topic.topic_title}
                            </div>
                            {this.renderInfo()}
                        </div>
                    </div>
                    {this.renderAttendance()}
                    {this.renderPhoto()}
                </Link>
                {this.renderSourceLink()}
            </div>
        )
    }
}

class TopicCard extends Component {
    // Render helper functions begin.
    // renderAdsense = () => {
    //     if (this.props.index % 5 !== 3) return null

    //     return (
    //         <div className="rekl-container">
    //             <AdSense.Google
    //                 className="adsbygoogle"
    //                 client="ca-pub-5093736351800898"
    //                 slot="5013158262"
    //                 layout="in-article"
    //                 format="fluid"
    //             />
    //         </div>
    //     )
    // }
    // Render helper functions end.

    render() {
        const post = this.props.post,
            topic = post.Topic

        return (
            <div className="home-bestposts-topic-container">
                {/* {this.renderAdsense()} */}
                <Link to={{ pathname: '/topic/' + topic.topic_id }}>
                    <div className="home-topic-title-container">
                        <div className="home-topic-title-wrapper">
                            <div className="home-topic-title">
                                {topic.topic_title}
                                {/* ({topic.Category.category_name}) */}
                            </div>
                        </div>
                    </div>
                </Link>
                <SinglePost Post={post} getPosts={this.props.getPosts} />
            </div>
        )
    }
}

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            events: {
                isUpcomingEventsDownloading: false,
                UpcomingEvents: [],
                pagination: {
                    currentPage: 1,
                    lastPage: 1,
                },
            },
            posts: {
                isBestPostsDownloading: false,
                BestPosts: [],
                pagination: {
                    currentPage: 1,
                    lastPage: 1,
                },
            },
        }
    }

    componentDidMount() {
        // Gets city ID from cookie. Sets a default "All Cities" value if value is falsy.
        const cityID = getCookie('city') || '0'
        // Gets the name of the city from given city ID.
        const cityName = getCityName(cityID)
        // Sets the found city info into React Redux.
        const { setCity } = this.props
        setCity({ cityID, cityName })
        // Fills two main branches with respected number of items.
        this.getUpcomingEvents()
        this.getBestPosts()
    }

    componentDidUpdate(prevProps) {
        const { navigation, User, City } = this.props

        // Checks if there is a city change, user login change or navigation change.
        const didPropsChanged =
            !isEqual(User, prevProps.User) ||
            !isEqual(City, prevProps.City) ||
            !isEqual(navigation.leftframe, prevProps.navigation.leftframe)

        // Sets state to default values and fills two main branches with respected number of items.
        if (didPropsChanged) {
            this.resetState()
            this.getUpcomingEvents()
            this.getBestPosts()
        }
    }

    // Sets state to default values.
    resetState = () => {
        this.setState({
            events: {
                isUpcomingEventsDownloading: false,
                UpcomingEvents: [],
                pagination: {
                    currentPage: 1,
                    lastPage: 1,
                },
            },
            posts: {
                isBestPostsDownloading: false,
                BestPosts: [],
                pagination: {
                    currentPage: 1,
                    lastPage: 1,
                },
            },
        })
    }

    // Redirects to leftframe menu according to its event/topic parameter via its state.
    handleRedirect = (isEvent) => {
        const { navigation, setLeftframe } = this.props

        setLeftframe({
            ...navigation.leftframe,
            isMobileActive: true,
            menu: {
                isEventSelected: isEvent,
                isTopicSelected: !isEvent,
            },
        })
    }

    // Opens the signup modal.
    handleClickSignup = () => {
        const { setTopbar } = this.props

        setTopbar({
            isModalActive: true,
            menu: {
                isRegisterMenuSelected: true,
                isLoginMenuSelected: false,
            },
        })
    }

    handleClickProfile = () => {
        const { history, User } = this.props

        history.push('/profile/' + User.id)
    }

    // Fetchs upcoming events according to current page number.
    getUpcomingEvents = async (targetpagenumber = 1) => {
        const { cityID } = this.props.City

        try {
            // Shows user a loading animation.
            updateState(this, 'events', { isUpcomingEventsDownloading: true })

            // Gets the next upcoming events from db according to page number and selected city.
            const url = `${API_DIRECTORY}/getUpcomingEvents`
            const body = JSON.stringify({
                city_id: cityID,
                targetpagenumber,
            })
            const responseUpcomingEvents = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=UTF-8',
                },
                body,
                credentials: 'include',
            })
            const { status, UpcomingEvents, totaleventcount } =
                responseUpcomingEvents

            if (status === 'success') {
                // Checks if returned events are first in queue or different from the previous ones.
                const isNewEventsFirst =
                    !this.state.events.UpcomingEvents.length
                const isNewEventsDifferent =
                    JSON.stringify(this.state.events.UpcomingEvents) !==
                    JSON.stringify(UpcomingEvents)

                // Adds new events to the current event array state if conditions are met.
                // Otherwise, makes a new aray from the new events.
                this.setState((prevState) => ({
                    ...prevState,
                    events: {
                        ...prevState.events,
                        UpcomingEvents:
                            isNewEventsFirst || isNewEventsDifferent
                                ? this.state.events.UpcomingEvents.concat(
                                      UpcomingEvents
                                  )
                                : UpcomingEvents,
                    },
                }))

                // Sets total page number according to number of events left.
                if (totaleventcount > 5)
                    this.setState((prevState) => ({
                        ...prevState,
                        events: {
                            ...prevState.events,
                            pagination: {
                                ...prevState.events.pagination,
                                lastPage: Math.ceil(totaleventcount / 5),
                            },
                        },
                    }))
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
            updateState(this, 'events', { isUpcomingEventsDownloading: false })
        }
    }

    // Renders a definite number of next events via pagination state.
    handleShowMoreEvents = () => {
        const { currentPage } = this.state.events.pagination
        this.getUpcomingEvents(currentPage + 1)
        this.setState((prevState) => ({
            ...prevState,
            events: {
                ...prevState.events,
                pagination: {
                    ...prevState.events.pagination,
                    currentPage: prevState.events.pagination.currentPage + 1,
                },
            },
        }))
    }

    // Fetchs best posts according to current page number.
    getBestPosts = async (targetpagenumber = 1) => {
        try {
            // Shows user a loading animation.
            updateState(this, 'posts', { isBestPostsDownloading: true })

            const url = `${API_DIRECTORY}/getBestPosts`
            const body = JSON.stringify({
                targetpagenumber,
            })

            // Gets the next best posts from db according to page number.
            const responseBestPosts = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=UTF-8',
                },
                body,
                credentials: 'include',
            })
            const { status, BestPosts, totalpostcount } = responseBestPosts

            if (status === 'success') {
                // Checks if returned posts are first in queue or different from the previous ones.
                const isNewPostsFirst = !this.state.posts.BestPosts.length
                const isNewPostsDifferent =
                    JSON.stringify(this.state.posts.BestPosts) !==
                    JSON.stringify(BestPosts)

                // Adds new posts to the current post array state if conditions are met.
                // Otherwise, makes a new aray from the new posts.
                this.setState((prevState) => ({
                    ...prevState,
                    posts: {
                        ...prevState.posts,
                        BestPosts:
                            isNewPostsFirst || isNewPostsDifferent
                                ? prevState.posts.BestPosts.concat(BestPosts)
                                : BestPosts,
                    },
                }))

                // Sets total page number according to number of posts left.
                if (totalpostcount > 5)
                    this.setState((prevState) => ({
                        ...prevState,
                        posts: {
                            ...prevState.posts,
                            pagination: {
                                ...prevState.posts.pagination,
                                lastPage: Math.ceil(totalpostcount / 5),
                            },
                        },
                    }))
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
            updateState(this, 'posts', { isBestPostsDownloading: false })
        }
    }

    // Renders a definite number of next posts via pagination state.
    handleShowMorePosts = () => {
        const { currentPage } = this.state.posts.pagination
        this.getBestPosts(currentPage + 1)
        this.setState((prevState) => ({
            ...prevState,
            posts: {
                ...prevState.posts,
                pagination: {
                    ...prevState.posts.pagination,
                    currentPage: prevState.posts.pagination.currentPage + 1,
                },
            },
        }))
    }

    // Render helper functions begin.
    renderWelcomeArea = () => {
        const { User } = this.props
        const isUserLoggedin = checkUserLoggedinStatus(User)

        return (
            <div className="home-welcomemsg">
                {/* <svg className="home-welcomemsg-text home-welcomemsg-text-left">
                    <path
                        id="curve"
                        className="home-welcomemsg-text-curve"
                        d="M200 200 Q 0 0, 50 50"
                    />
                    <text fill="white">
                        <textPath href="#curve">
                            Güncel etkinlikleri ve kültür-sanat konularını
                            keşfet.
                        </textPath>
                    </text>
                </svg> */}
                <h1 className="home-welcomemsg-text home-welcomemsg-text-left">
                    Yakındaki etkinlikleri ve
                    <br></br> kültür-sanat konularını keşfet.
                </h1>
                <h1 className="home-welcomemsg-text home-welcomemsg-text-right">
                    Hatırlatmaları al.
                    <br></br>Etkinlikleri kaçırma!
                </h1>
                <div className="home-redirect-topics-bottom">
                    <div className="home-redirect-topics-buttons-wrapper home-redirect-topics-buttons-wrapper-left">
                        <div className="home-redirect-button-wrapper">
                            <input
                                className="home-redirect-button home-redirect-button-topics"
                                value="Etkinliklere Göz At"
                                onClick={() => this.handleRedirect(true)}
                                type="button"
                            />
                        </div>
                        <div className="home-redirect-button-wrapper">
                            <input
                                className="home-redirect-button home-redirect-button-events"
                                value="Konulara Göz At"
                                onClick={() => this.handleRedirect(false)}
                                type="button"
                            />
                        </div>
                    </div>
                    <div className="home-redirect-topics-buttons-wrapper home-redirect-topics-buttons-wrapper-right">
                        <div className="home-redirect-button-wrapper">
                            {isUserLoggedin ? (
                                <input
                                    className="home-redirect-button home-redirect-button-signup"
                                    value="Profiline Git"
                                    onClick={this.handleClickProfile}
                                    type="button"
                                />
                            ) : (
                                <input
                                    className="home-redirect-button home-redirect-button-signup"
                                    value="Kayıt Ol"
                                    onClick={this.handleClickSignup}
                                    type="button"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderSkeletonUpcomingEvents = () => {
        return [...Array(5)].map((_, i) => (
            <div
                className="home-upcomingevents-event-container"
                key={'home-upcomingevents-event-container' + i}
            >
                <div className="home-topic-title-container">
                    <div className="home-topic-title-wrapper">
                        <div className="home-topic-title home-topic-title-skeleton"></div>
                        <div className="topic-info-container">
                            <span className="topic-venue-wrapper">
                                <img
                                    className="topic-venue-icon"
                                    src={iconMapLocationDot}
                                    alt={iconMapLocationDot}
                                />
                                <span className="home-topic-venue-skeleton"></span>
                                <span className="topic-time-wrapper">
                                    <span className="topic-date-wrapper">
                                        <img
                                            className="topic-date-icon"
                                            src={iconCalendarDays}
                                            alt={iconCalendarDays}
                                        />
                                        <span className="home-topic-date-skeleton"></span>
                                    </span>
                                    <span className="topic-clock-wrapper">
                                        <img
                                            className="topic-clock-icon"
                                            src={iconClock}
                                            alt={iconClock}
                                        />
                                        <span className="home-topic-clock-skeleton"></span>
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="home-singlepost-container">
                    <span className="home-singlepost-text-container">
                        <span className="home-singlepost-text-skeleton"></span>
                    </span>
                </div>
            </div>
        ))
    }
    renderUpcomingEvents = () => {
        const { UpcomingEvents } = this.state.events

        // Renders nothing if upcoming events array is empty or not valid.
        if (!Array.isArray(UpcomingEvents) || UpcomingEvents.length === 0) {
            return null
        }

        // Renders every upcoming event in a loop.
        return UpcomingEvents.map((Event, index) => (
            <EventCard
                key={`home-upcomingevent-topicid-${Event.topic_id}`}
                index={index}
                topic={Event}
            />
        ))
    }
    renderShowMoreEventsButton = () => {
        const { pagination } = this.state.events
        const { currentPage, lastPage } = pagination

        // Renders nothing if current page is the last or one of the pages in pagination is empty/not valid.
        if (
            typeof currentPage !== 'number' ||
            typeof lastPage !== 'number' ||
            !currentPage ||
            !lastPage ||
            currentPage === lastPage
        ) {
            return null
        }

        // Renders a clickable show more button.
        return (
            <div className="home-upcomingevents-showmore-button-wrapper">
                <input
                    className="home-upcomingevents-showmore-button"
                    value="Daha Fazla Etkinlik Göster"
                    onClick={this.handleShowMoreEvents}
                    type="button"
                />
            </div>
        )
    }
    renderUpcomingEventsArea = () => {
        const { isUpcomingEventsDownloading } = this.state.events

        return (
            <div className="home-upcomingevents-wrapper">
                <div className="home-upcomingevents-title-wrapper">
                    <div className="home-upcomingevents-title">
                        YAKLAŞAN ETKİNLİKLER
                    </div>
                </div>
                <div className="home-upcomingevents-events-container">
                    {this.renderUpcomingEvents()}
                    {isUpcomingEventsDownloading &&
                        this.renderSkeletonUpcomingEvents()}
                </div>
                {!isUpcomingEventsDownloading &&
                    this.renderShowMoreEventsButton()}
            </div>
        )
    }

    renderSkeletonBestPosts = () => {
        return [...Array(5)].map((_, i) => (
            <div
                className="home-bestposts-topic-container"
                key={'home-bestposts-topic-container' + i}
            >
                <div className="home-topic-title-container">
                    <div className="home-topic-title-wrapper">
                        <div className="home-topic-title home-topic-title-skeleton"></div>
                    </div>
                </div>
                <div className="home-singlepost-container">
                    <span className="home-singlepost-text-container">
                        <span className="home-singlepost-text-skeleton"></span>
                    </span>
                    <div className="singlepost-bottom-container">
                        <div className="singlepost-leftmenu-container">
                            <div className="singlepost-leftmenu-wrapper">
                                <div className="singlepost-upvote-container">
                                    <img
                                        className="singlepost-vote-upvote"
                                        src={iconAngleUp}
                                        alt={iconAngleUp}
                                    />
                                    <span className="singlepost-vote-upvotecount-skeleton"></span>
                                </div>
                                <div className="singlepost-downvote-container">
                                    <img
                                        className="singlepost-vote-downvote"
                                        src={iconAngleDown}
                                        alt={iconAngleDown}
                                    />
                                    <span className="singlepost-vote-downvotecount-skeleton"></span>
                                </div>
                                <div className="singlepost-social-container">
                                    <img
                                        className="singlepost-social-share"
                                        src={iconShareNodes}
                                        alt={iconShareNodes}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="singlepost-rightmenu-container">
                            <div className="singlepost-user-wrapper">
                                <span className="singlepost-username-skeleton"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }
    renderBestPosts = () => {
        const { getPosts } = this.props
        const { BestPosts } = this.state.posts

        // Renders nothing if best posts array is empty or not valid.
        if (!Array.isArray(BestPosts) || BestPosts.length === 0) {
            return null
        }

        // Renders every best post in a loop.
        return BestPosts.map((Post, index) => (
            <TopicCard
                key={`home-upcomingevent-topicid-${Post.post_id}`}
                index={index}
                post={Post}
                getPosts={getPosts}
            />
        ))
    }
    renderShowMorePostsButton = () => {
        const { pagination } = this.state.posts
        const { currentPage, lastPage } = pagination

        // Renders nothing if current page is the last or one of the pages in pagination is empty/not valid.
        if (
            typeof currentPage !== 'number' ||
            typeof lastPage !== 'number' ||
            !currentPage ||
            !lastPage ||
            currentPage === lastPage
        ) {
            return null
        }

        // Renders a clickable show more button.
        return (
            <div className="home-bestposts-showmore-button-wrapper">
                <input
                    className="home-bestposts-showmore-button"
                    value="Daha Fazla Gönderi Göster"
                    onClick={this.handleShowMorePosts}
                    type="button"
                />
            </div>
        )
    }
    renderBestPostsArea = () => {
        const { isBestPostsDownloading } = this.state.posts

        return (
            <div className="home-bestposts-wrapper">
                <div className="home-bestposts-title-wrapper">
                    <div className="home-bestposts-title">
                        AYIN EN İYİ GÖNDERİLERİ
                    </div>
                </div>
                <div className="home-bestposts-topics-container">
                    {this.renderBestPosts()}
                    {isBestPostsDownloading && this.renderSkeletonBestPosts()}
                </div>
                {!isBestPostsDownloading && this.renderShowMorePostsButton()}
            </div>
        )
    }
    // Render helper functions end.

    render() {
        return (
            <>
                <Helmet>
                    <title>{`Şallı Turna | İnteraktif Etkinlik ve Kültür-Sanat Platformu`}</title>
                </Helmet>
                <div className="home-container">
                    {this.renderWelcomeArea()}
                    <div className="home-cards-wrapper">
                        {this.renderUpcomingEventsArea()}
                        {this.renderBestPostsArea()}
                    </div>
                </div>
            </>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(Home)
