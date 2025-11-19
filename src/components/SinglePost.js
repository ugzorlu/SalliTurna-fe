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
    showTooltip,
    hideTooltip,
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
            tooltip: {
                isVisible: false,
                x: 0,
                y: 0,
                text: '',
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

    handleSendMessage = () => {
        const { User, Post, setDialog, history } = this.props
        const receiverUserId = Post.User.user_id

        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) return

        // Routes inbox with receiever population.
        history.push('/inbox?corresponderid=' + receiverUserId)
    }

    handleUpvote = () => {
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

    handleDownvote = () => {
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

    showTooltip = (e, text) => {
        showTooltip(this, e, text)
    }

    hideTooltip = () => {
        hideTooltip(this)
    }

    getTwitterWidgets = (postText) => {
        // Defines a regex string to match all X/Twitter URLs with or without containing query strings.
        const TWEET_URL_REGEX =
            /(https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/\w+\/status\/\d+(?:\?[^\s]*)?/
        const tweetUrlRegex = new RegExp(TWEET_URL_REGEX, 'g') // Initializes with the global flag (g) to match all occurrences

        // Returns the original text as-is when there are no tweet URLs.
        if (!tweetUrlRegex.test(postText)) return postText

        // Resets regex's internal cursor (lastIndex). TIP: Need for all reusable regex containing the g flag to avoid missed matches or inconsistency.
        tweetUrlRegex.lastIndex = 0

        // Builds a linear, ordered list of the post text. Each part corresponds to either a plain text segment or a tweet URL detected by the regex.
        const parts = []
        let lastIndex = 0
        // Iterates over all tweet URL matches in their natural order.
        for (const match of postText.matchAll(tweetUrlRegex)) {
            const url = match[0] // The full matched tweet URL
            const idx = match.index ?? -1 // Safe lookup of the match position

            // Extracts and emits text as a part if present.
            if (idx > lastIndex) {
                parts.push({
                    type: 'text',
                    text: postText.substring(lastIndex, idx),
                })
            }

            // Emits a part representing the matched tweet URL itself.
            parts.push({ type: 'tweet', url })

            // Updates the cursor to the end of the current match.
            lastIndex = idx + url.length
        }

        // Captures trailing text as a final part if present.
        if (lastIndex < postText.length) {
            parts.push({ type: 'text', text: postText.substring(lastIndex) })
        }

        // Helper function to extract Tweet ID from the URL.
        const extractTweetId = (url) => {
            const tweetIdMatch = url.match(/\/status\/(\d+)/)
            return tweetIdMatch ? tweetIdMatch[1] : null
        }

        // Maps plain texts and tweets in parts to React elements in the exact order.
        const content = parts
            .map((part, i) => {
                if (part.type === 'text') {
                    return part.text ? (
                        <span key={`text-${i}`}>{part.text}</span>
                    ) : null
                }

                const tweetId = extractTweetId(part.url)
                if (!tweetId) return null
                return (
                    <div key={`tweet-${tweetId}`} className="singlepost-tweet">
                        <TwitterTweetEmbed tweetId={tweetId} />
                    </div>
                )
            })
            .filter(Boolean) // Cleans falsy text parts

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
        const { isVisible, x, y, text } = this.state.tooltip

        return (
            <>
                <div
                    className="singlepost-vote-container"
                    onMouseEnter={(e) => this.showTooltip(e, 'Oyla')}
                    onMouseLeave={this.hideTooltip}
                >
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
                {isVisible && (
                    <div
                        className="singlepost-tooltip"
                        style={{
                            position: 'fixed',
                            left: x,
                            top: y,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        {text}
                    </div>
                )}
            </>
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
        const { isVisible, x, y, text } = this.state.tooltip

        return (
            <>
                <div
                    className="singlepost-social-container"
                    onMouseEnter={(e) => this.showTooltip(e, 'Paylaş')}
                    onMouseLeave={this.hideTooltip}
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
                            display: isPostShareDropdownHidden
                                ? 'none'
                                : 'flex',
                        }}
                    >
                        {this.renderSocialAction(
                            'twitter',
                            this.handleShareOnTwitter,
                            logoTwitter,
                            'X (Twitter)'
                        )}
                        {this.renderSocialAction(
                            'facebook',
                            this.handleShareOnFacebook,
                            logoFacebook,
                            'Facebook'
                        )}
                    </div>
                </div>
                {isVisible && (
                    <div
                        className="singlepost-tooltip"
                        style={{
                            position: 'fixed',
                            left: x,
                            top: y,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        {text}
                    </div>
                )}
            </>
        )
    }

    renderUserInfo = () => {
        const { Post, User } = this.props
        const { isVisible, x, y, text } = this.state.tooltip
        const postOwner = Post.User
        const isPostEditable = User.username === postOwner.user_name

        // Renders user's name and message button if the current user is different.
        return (
            <div className="singlepost-user-wrapper">
                <Link to={`/profile/${postOwner.user_id}`}>
                    <span
                        className="singlepost-username"
                        onMouseEnter={(e) => this.showTooltip(e, 'Profile bak')}
                        onMouseLeave={this.hideTooltip}
                    >
                        {postOwner.user_name}
                    </span>
                    {isVisible && (
                        <div
                            className="singlepost-tooltip"
                            style={{
                                position: 'fixed',
                                left: x,
                                top: y,
                                transform: 'translate(-50%, -100%)',
                            }}
                        >
                            {text}
                        </div>
                    )}
                </Link>
                {!isPostEditable && (
                    <>
                        <img
                            className="singlepost-sendmessage"
                            onClick={this.handleSendMessage}
                            onMouseEnter={(e) =>
                                this.showTooltip(e, 'Mesaj at')
                            }
                            onMouseLeave={this.hideTooltip}
                            src={iconEnvelope}
                            alt={iconEnvelope}
                        />
                        {isVisible && (
                            <div
                                className="singlepost-tooltip"
                                style={{
                                    position: 'fixed',
                                    left: x,
                                    top: y,
                                    transform: 'translate(-50%, -100%)',
                                }}
                            >
                                {text}
                            </div>
                        )}
                    </>
                )}
            </div>
        )
    }

    renderTimeStamp = () => {
        const { Post } = this.props
        const { isVisible, x, y, text } = this.state.tooltip
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
            <>
                <div
                    className="singlepost-date-wrapper"
                    onMouseEnter={(e) => this.showTooltip(e, 'Gönderiye bak')}
                    onMouseLeave={this.hideTooltip}
                >
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
                {isVisible && (
                    <div
                        className="singlepost-tooltip"
                        style={{
                            position: 'fixed',
                            left: x,
                            top: y,
                            transform: 'translate(-50%, -100%)',
                        }}
                    >
                        {text}
                    </div>
                )}
            </>
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
                <>
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
                </>
            )
        }
        return (
            <>
                <div
                    className="singlepost-report-container"
                    onClick={this.handleReport}
                    onMouseEnter={(e) => this.showTooltip(e, 'Şikayet et')}
                    onMouseLeave={this.hideTooltip}
                >
                    <img
                        className="singlepost-report"
                        src={iconExclamation}
                        alt={iconExclamation}
                    />
                </div>
            </>
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
