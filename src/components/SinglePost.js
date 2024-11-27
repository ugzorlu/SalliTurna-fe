import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})
import { TwitterTweetEmbed } from 'react-twitter-embed'
import Linkify from 'linkify-react'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/tr'
dayjs.extend(calendar)
dayjs.extend(localizedFormat)
dayjs.extend(timezone)
dayjs.extend(relativeTime)
dayjs.locale('tr')

/* Constants and Helpers */
import {
    API_DIRECTORY,
    WEB_DIRECTORY,
    CLOUDINARY_NAME,
    FACEBOOK_APP_ID,
} from '../utils/constants'
import { calendarStrings } from '../utils/constants'
import {
    checkUserLoggedinStatus,
    fetchWithErrorHandling,
    updateState,
    bindDocumentEvents,
    unbindDocumentEvents,
} from '../utils/commons'
import { setDialog } from '../actions/dialogActions'
import { setModal } from '../actions/modalActions'

/* Styling */
import iconAngleUp from '../assets/fontawesome/angle-up-solid.svg'
import iconAngleDown from '../assets/fontawesome/angle-down-solid.svg'
import iconShareNodes from '../assets/fontawesome/share-nodes-solid.svg'
import iconExclamation from '../assets/fontawesome/exclamation-solid.svg'
import iconCaretDown from '../assets/fontawesome/caret-down-solid.svg'
import iconEnvelope from '../assets/fontawesome/envelope-solid.svg'
import logoTwitter from '../assets/fontawesome/x-twitter.svg'
import logoFacebook from '../assets/fontawesome/facebook-f.svg'
import '../styles/SinglePost.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        User: state.user,
    }
}
const mapDispatchToProps = {
    setDialog,
    setModal,
}
// Redux functions to connect Redux store end.

class SinglePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            voteCount: {
                upvoteCount: props.Post.totalUpvoteCount ?? 0,
                downvoteCount: props.Post.totalDownvoteCount ?? 0,
            },
            userRelation: {
                isPostUpVotedByUser: props.Post.isPostUpVotedByUser ?? false,
                isPostDownVotedByUser:
                    props.Post.isPostDownVotedByUser ?? false,
            },
            menu: {
                isPostActionDropdownHidden: true,
                isPostShareDropdownHidden: true,
                lastEventTime: 0,
            },
        }
        this.postActionDropdownRef = createRef()
        this.postShareDropdownRef = createRef()
    }

    componentDidMount() {
        // Binds click events to the document. Optimized for mobile devices.
        // Prevents trigger first time clicks via capture option.
        bindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideMenu,
            { capture: true }
        )
    }

    componentWillUnmount() {
        // Unbinds click events from the document. Optimized for mobile devices.
        unbindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideMenu,
            { capture: true }
        )
    }

    togglePostAction = () => {
        const { isPostActionDropdownHidden } = this.state.menu
        updateState(this, 'menu', {
            isPostActionDropdownHidden: !isPostActionDropdownHidden,
        })
    }

    togglePostShare = () => {
        const { isPostShareDropdownHidden } = this.state.menu
        updateState(this, 'menu', {
            isPostShareDropdownHidden: !isPostShareDropdownHidden,
        })
    }

    handleClickOutsideMenu = (e) => {
        // Prevents the same action from firing multiple times by using last event time to debounce.
        // 300ms is a standard threshold for older devices or legacy browsers.
        const currentTime = new Date().getTime()
        const { lastEventTime } = this.state.menu
        if (currentTime - lastEventTime < 300) return

        // Hides menus from the view according to click area.
        const postActionDropdown = this.postActionDropdownRef.current
        if (postActionDropdown && !postActionDropdown.contains(e.target)) {
            updateState(this, 'menu', {
                isPostActionDropdownHidden: true,
                lastEventTime: currentTime,
            })
        }
        const postShareDropdown = this.postShareDropdownRef.current
        if (postShareDropdown && !postShareDropdown.contains(e.target)) {
            updateState(this, 'menu', {
                isPostShareDropdownHidden: true,
                lastEventTime: currentTime,
            })
        }
    }

    handleEditPost = () => {
        const { Post, history, showPostForm } = this.props

        // Routes the post page if it's not already there. Shows the post text area in any case.
        if (history.location.pathname.includes('/post/')) {
            showPostForm()
        } else {
            history.push({
                pathname: '/post/' + Post.post_id,
                hash: 'edit',
            })
        }
    }

    handleDeletePost = () => {
        const { setDialog } = this.props

        // Shows a warning before deletion process.
        setDialog({
            isDialogActive: true,
            status: 'warning',
            message: 'Gönderiyi silmek istediğinize emin misiniz?',
            action: this.deletePost,
        })
    }

    deletePost = async () => {
        try {
            const { setDialog, Post } = this.props
            const { post_id, Topic } = Post
            const { topic_id } = Topic

            // Removes current post from db.
            const body = JSON.stringify({
                post_id,
                topic_id,
            })
            const responseDeletePost = await fetchWithErrorHandling(
                `${API_DIRECTORY}/deletePost/${post_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body,
                    credentials: 'include',
                }
            )
            if (responseDeletePost.status === 'success') {
                setDialog({
                    isDialogActive: true,
                    status: 'success',
                    message: 'Silme işlemi başarılı.',
                })
                if (this.props.location.pathname.includes('/topic/')) {
                    this.props.getPosts()
                } else {
                    this.props.history.push('/topic/' + topic_id)
                }
            } else {
                setDialog({
                    isDialogActive: true,
                    status: 'error',
                    message: 'Silme işlemi başarısız.',
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

    handleShareOnTwitter = () => {
        const { Post } = this.props
        const postUrl = encodeURIComponent(
            `${WEB_DIRECTORY}/post/${Post.post_id}`
        )
        const twitterUrl = `https://twitter.com/intent/tweet?url=${postUrl}`

        window.open(twitterUrl)
    }

    handleShareOnFacebook = () => {
        const { Post } = this.props
        const postUrl = `${WEB_DIRECTORY}/post/${Post.post_id}`

        FB.ui(
            {
                method: 'share',
                href: postUrl,
            },
            function (response) {
                if (response && !response.error_message) {
                    setDialog({
                        isDialogActive: true,
                        status: 'success',
                        message: 'Paylaşım başarılı.',
                    })
                } else {
                    setDialog({
                        isDialogActive: true,
                        status: 'error',
                        message: response.error_message,
                    })
                }
            }
        )
    }

    handleReport = () => {
        const { Post, history } = this.props

        // Routes the contact page with report text population.
        history.push('/contact?postid=' + Post.post_id)
    }

    handleSendMessage = (e) => {
        const { User, Post, setDialog, history } = this.props
        const receiverUserId = Post.User.user_id

        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) return

        // Routes inbox with receiever population.
        history.push('/inbox?corresponderid=' + receiverUserId)
    }

    handleUpvote = (e) => {
        const { User, setDialog } = this.props
        const { isPostUpVotedByUser } = this.state.userRelation

        // Checks if user is logged in and shows dialog if not.
        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) return

        // Calls related function according the post vote status of current user.
        isPostUpVotedByUser
            ? this.deletePostVote(true)
            : this.insertPostVote(true)
    }

    handleDownvote = (e) => {
        const { User, setDialog } = this.props
        const { isPostDownVotedByUser } = this.state.userRelation

        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) return

        // Calls related function according the post vote status of current user.
        isPostDownVotedByUser
            ? this.deletePostVote(false)
            : this.insertPostVote(false)
    }

    insertPostVote = async (isUpvote) => {
        const { setDialog, Post } = this.props

        try {
            const { upvoteCount, downvoteCount } = this.state.voteCount
            const { isPostUpVotedByUser, isPostDownVotedByUser } =
                this.state.userRelation

            // Adds post vote by current user from db.
            const body = JSON.stringify({
                post_id: Post.post_id,
                isUpvote,
            })
            const responseInsertPostVote = await fetchWithErrorHandling(
                `${API_DIRECTORY}/insertPostVote`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body,
                    credentials: 'include',
                }
            )
            if (responseInsertPostVote.status === 'success') {
                // Shows changes related vote counts and current user votes by updating related status.
                if (isUpvote) {
                    updateState(this, 'voteCount', {
                        upvoteCount: upvoteCount + 1,
                        downvoteCount: isPostDownVotedByUser
                            ? downvoteCount - 1
                            : downvoteCount,
                    })
                    updateState(this, 'userRelation', {
                        isPostUpVotedByUser: true,
                        isPostDownVotedByUser: false,
                    })
                } else {
                    updateState(this, 'voteCount', {
                        downvoteCount: downvoteCount + 1,
                        upvoteCount: isPostUpVotedByUser
                            ? upvoteCount - 1
                            : upvoteCount,
                    })
                    updateState(this, 'userRelation', {
                        isPostUpVotedByUser: false,
                        isPostDownVotedByUser: true,
                    })
                }
            } else {
                setDialog({
                    isDialogActive: true,
                    status: responseInsertPostVote.status,
                    message: responseInsertPostVote.message,
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

    deletePostVote = async (isUpvote) => {
        try {
            const { setDialog, Post } = this.props
            const { upvoteCount, downvoteCount } = this.state.voteCount

            // Removes post vote by current user from db.
            const body = JSON.stringify({ post_id: Post.post_id })
            const responseDeletePostVote = await fetchWithErrorHandling(
                `${API_DIRECTORY}/deletePostVote`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body,
                    credentials: 'include',
                }
            )
            if (responseDeletePostVote.status === 'success') {
                // Shows changes related vote counts and current user votes by updating related status.
                if (isUpvote) {
                    updateState(this, 'voteCount', {
                        upvoteCount: upvoteCount - 1,
                    })
                    updateState(this, 'userRelation', {
                        isPostUpVotedByUser: false,
                    })
                } else {
                    updateState(this, 'voteCount', {
                        downvoteCount: downvoteCount - 1,
                    })
                    updateState(this, 'userRelation', {
                        isPostDownVotedByUser: false,
                    })
                }
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: response.status,
                    message: response.message,
                })
            }
        } catch (error) {
            // Displays error messages from fetch helper function.
            this.props.setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }

    handleOpenPhotoInModal = () => {
        const { setModal, Post } = this.props
        setModal({ isModalActive: true, photoLink: Post.post_photo })
    }

    getTwitterWidgets = (postText) => {
        // Defines a regex to match all Twitter/X URLs.
        const twitterRegex =
            /(https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/\d+/g

        // Checks the post text if there are any matching URLs.
        const tweetUrls = postText.match(twitterRegex)
        if (!tweetUrls) {
            // Returns the original text as-is.
            return postText
        }

        // Extracts Tweet ID from the URL.
        const extractTweetId = (url) => {
            const tweetIdMatch = url.match(/\/status\/(\d+)/)
            return tweetIdMatch ? tweetIdMatch[1] : null
        }

        // Extracts non-tweet text parts while ignoring protocol fragments.
        const parts = []
        let lastIndex = 0
        tweetUrls.forEach((url) => {
            const matchIndex = postText.indexOf(url, lastIndex)

            // Pushs the text before the current tweet URL.
            if (matchIndex > lastIndex) {
                parts.push(postText.substring(lastIndex, matchIndex))
            }

            // Updates last index to the end of the current URL.
            lastIndex = matchIndex + url.length
        })
        // Pushs any remaining text after the last tweet URL.
        if (lastIndex < postText.length) {
            parts.push(postText.substring(lastIndex))
        }

        // Combines plain text and tweets in the correct order.
        const content = parts.reduce((acc, part, index) => {
            // Adds the plain text part.
            acc.push(<span key={`text-${index}`}>{part}</span>)

            // Adds corresponding tweet if available.
            if (tweetUrls[index]) {
                const tweetId = extractTweetId(tweetUrls[index])
                if (tweetId) {
                    acc.push(
                        <div
                            key={`tweet-${tweetId}`}
                            className="singlepost-tweet"
                        >
                            <TwitterTweetEmbed tweetId={tweetId} />
                        </div>
                    )
                }
            }

            return acc
        }, [])

        // Returns the final composed content.
        return content
    }

    setMetadata = () => {
        // Sets Facebook metadata for sharing functionality.
        return (
            <Helmet>
                <script>
                    {`window.fbAsyncInit = function() {
                    FB.init({
                        appId            : '${FACEBOOK_APP_ID}',
                        autoLogAppEvents : true,
                        xfbml            : false,
                        version          : 'v4.0'
                    })
                }`}
                </script>
                <script
                    async
                    defer
                    src="https://connect.facebook.net/tr_TR/sdk.js"
                />
            </Helmet>
        )
    }

    // Render helper functions begin.
    renderPhoto = () => {
        const { Post } = this.props

        const myImage = myCloudinary.image(Post.post_photo)

        // Renders photo if there is any.
        if (Post.post_photo) {
            return (
                <div
                    className="singlepost-photo-container"
                    onClick={this.handleOpenPhotoInModal}
                >
                    <AdvancedImage
                        width="100%"
                        height="auto"
                        cldImg={myImage}
                        alt="Post Foto"
                    />
                </div>
            )
        }
        return null
    }

    renderText = () => {
        const { Post } = this.props
        const postText = this.getTwitterWidgets(Post.post_text)

        return (
            <div className="singlepost-text-container">
                <span className="singlepost-text">
                    <Linkify options={{ target: '_blank' }}>{postText}</Linkify>
                </span>
            </div>
        )
    }

    renderVoteButton = (type, isActive, count, onClick, icon) => {
        // Combines CSS classes according to the vote status.
        // Removes any falsy value and seperates classes by a single space.
        const buttonClass = [
            `singlepost-vote-${type}`,
            isActive && `singlepost-vote-${type}-active`,
        ]
            .filter(Boolean)
            .join(' ')

        return (
            <span className={`singlepost-${type}-container`} onClick={onClick}>
                <img className={buttonClass} src={icon} alt={icon} />
                <span className={`singlepost-vote-${type}count`}>{count}</span>
            </span>
        )
    }
    renderVote = () => {
        const { upvoteCount, downvoteCount } = this.state.voteCount
        const { isPostUpVotedByUser, isPostDownVotedByUser } =
            this.state.userRelation

        return (
            <div className="singlepost-vote-container">
                {this.renderVoteButton(
                    'upvote',
                    isPostUpVotedByUser,
                    upvoteCount,
                    this.handleUpvote,
                    iconAngleUp
                )}
                {this.renderVoteButton(
                    'downvote',
                    isPostDownVotedByUser,
                    downvoteCount,
                    this.handleDownvote,
                    iconAngleDown
                )}
            </div>
        )
    }

    renderSocialAction = (platform, onClick, icon, text) => (
        <div
            className={`singlepost-social-action singlepost-social-action-${platform}`}
            onClick={onClick}
        >
            <img
                className={`singlepost-social-${platform}-logo`}
                src={icon}
                alt={icon}
            />
            <span className={`singlepost-social-${platform}-text`}>{text}</span>
        </div>
    )
    renderSocialDropdown = () => {
        const { isPostShareDropdownHidden } = this.state.menu

        return (
            <div
                className="singlepost-social-container"
                onClick={this.togglePostShare}
            >
                <img
                    className="singlepost-social-share"
                    src={iconShareNodes}
                    alt={iconShareNodes}
                />
                <div
                    className="singlepost-social-dropdown"
                    ref={this.postShareDropdownRef}
                    style={{
                        display: isPostShareDropdownHidden ? 'none' : 'flex',
                    }}
                >
                    {this.renderSocialAction(
                        'twitter',
                        this.handleShareOnTwitter,
                        logoTwitter,
                        'Twitter'
                    )}
                    {this.renderSocialAction(
                        'facebook',
                        this.handleShareOnFacebook,
                        logoFacebook,
                        'Facebook'
                    )}
                </div>
            </div>
        )
    }

    renderUserInfo = () => {
        const { Post, User } = this.props
        const postOwner = Post.User
        const isPostEditable = User.username === postOwner.user_name

        // Renders user's name and message button if the current user is different.
        return (
            <div className="singlepost-user-wrapper">
                <Link to={`/profile/${postOwner.user_id}`}>
                    <span className="singlepost-username">
                        {postOwner.user_name}
                    </span>
                </Link>
                {!isPostEditable && (
                    <img
                        className="singlepost-sendmessage"
                        onClick={this.handleSendMessage}
                        src={iconEnvelope}
                        alt={iconEnvelope}
                    />
                )}
            </div>
        )
    }

    renderTimeStamp = () => {
        const { Post } = this.props
        const postDate = dayjs(Post.post_date)
        const editDate = Post.edit_date ? dayjs(Post.edit_date) : null
        const isEditSameDay = editDate
            ? editDate.isSame(postDate, 'day')
            : false

        const postDatePrettyText = postDate.calendar(null, calendarStrings)
        const editDatePrettyText = editDate
            ? isEditSameDay
                ? editDate.format('LT')
                : editDate.calendar(null, calendarStrings)
            : null

        // Renders date/time of the post and gives link to its individual page.
        return (
            <div className="singlepost-date-wrapper">
                <Link to={{ pathname: '/post/' + Post.post_id }}>
                    <span className="singlepost-postdate">
                        {postDatePrettyText}
                    </span>
                    {editDate && (
                        <span className="singlepost-editdate">
                            &nbsp;~ {editDatePrettyText}
                        </span>
                    )}
                </Link>
            </div>
        )
    }

    renderPostActions = () => {
        const { isPostActionDropdownHidden } = this.state.menu
        const { Post, User } = this.props
        const postOwner = Post.User
        const loggedinUser = User
        const isPostEditable = loggedinUser.username === postOwner.user_name

        // Renders edit/delete action menu if the user is same, report menu if not.
        if (isPostEditable) {
            return (
                <span className="singlepost-actions-wrapper">
                    <img
                        className="singlepost-actions-button"
                        onClick={this.togglePostAction}
                        src={iconCaretDown}
                        alt={iconCaretDown}
                    />
                    <div
                        className="singlepost-actions-dropdown"
                        ref={this.postActionDropdownRef}
                        style={{
                            display: isPostActionDropdownHidden
                                ? 'none'
                                : 'inline-block',
                        }}
                    >
                        <div
                            className="singlepost-actions-action singlepost-actions-edit"
                            onClick={this.handleEditPost}
                        >
                            Düzenle
                        </div>
                        <div
                            className="singlepost-actions-action singlepost-actions-delete"
                            onClick={this.handleDeletePost}
                        >
                            Sil
                        </div>
                    </div>
                </span>
            )
        }
        return (
            <div
                className="singlepost-report-container"
                onClick={this.handleReport}
            >
                <img
                    className="singlepost-report"
                    src={iconExclamation}
                    alt={iconExclamation}
                />
            </div>
        )
    }

    renderBottom = () => {
        const { isPostEventsFirstPost } = this.props

        // Renders menus if the post is not an event's first post.
        return (
            <div
                className="singlepost-bottom-container"
                style={{
                    display: isPostEventsFirstPost ? 'none' : 'flex',
                }}
            >
                <div className="singlepost-leftmenu-container">
                    <div className="singlepost-leftmenu-wrapper">
                        {this.renderVote()}
                        {this.renderSocialDropdown()}
                    </div>
                </div>
                <div className="singlepost-rightmenu-container">
                    <div className="singlepost-rightmenu-firstrow-wrapper">
                        {this.renderUserInfo()}
                    </div>
                    <div className="singlepost-rightmenu-secondrow-wrapper">
                        {this.renderTimeStamp()}
                        {this.renderPostActions()}
                    </div>
                </div>
            </div>
        )
    }
    // Render helper functions end.

    render() {
        return (
            <>
                {this.setMetadata()}
                <div className="singlepost-container">
                    {this.renderPhoto()}
                    {this.renderText()}
                    {this.renderBottom()}
                </div>
            </>
        )
    }
}

// Connects component to Redux.
const ConnectedSinglePost = connect(
    mapStateToProps,
    mapDispatchToProps
)(SinglePost)

// Exports component with React Router.
export default withRouter(ConnectedSinglePost)
