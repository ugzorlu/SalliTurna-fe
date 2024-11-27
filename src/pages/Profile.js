import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { byRadius, max } from '@cloudinary/url-gen/actions/roundCorners'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})
import isEqual from 'react-fast-compare'

/* Internal Components */
import SinglePost from '../components/SinglePost'

/* Constants and Helpers */
import { API_DIRECTORY, CLOUDINARY_NAME } from '../utils/constants'
import {
    validFileType,
    getReadableFileSize,
    updateState,
    fetchWithErrorHandling,
} from '../utils/commons'
import { setDialog } from '../actions/dialogActions'
import { setModal } from '../actions/modalActions'

/* Styling */
import iconCaretDown from '../assets/fontawesome/caret-down-solid.svg'
import iconAngleUp from '../assets/fontawesome/angle-up-solid.svg'
import iconAngleDown from '../assets/fontawesome/angle-down-solid.svg'
import iconShareNodes from '../assets/fontawesome/share-nodes-solid.svg'
import '../styles/Profile.scss'
import '../styles/Topic.scss'
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

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isUserDownloading: false,
            isPostsDownloading: false,
            Profile: {
                Posts: {
                    LatestPosts: null,
                },
            },
            pagination: {
                current_page: 1,
                total_page: 1,
            },
            selectcriteria: 'own',
        }

        this.profilePhotoRef = createRef()
    }

    componentDidMount() {
        this.getProfile()
    }

    componentDidUpdate(prevProps) {
        const { User, location } = this.props

        // Checks if there is a user login change or page change.
        const didPropsChanged =
            location.pathname !== prevProps.location.pathname ||
            !isEqual(User, prevProps.User)

        if (didPropsChanged) {
            this.getProfile()
        }
    }

    fetchPosts = async (url, payload, component) => {
        const { setDialog } = component.props
        const { Profile } = component.state

        try {
            component.setState({ isPostsDownloading: true })

            const response = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(payload),
                credentials: 'include',
            })

            const { status, message, Posts } = response

            if (status === 'success') {
                updateState(component, 'Profile', {
                    Posts: {
                        ...Profile?.Posts,
                        LatestPosts:
                            Profile?.Posts.LatestPosts !== Posts?.LatestPosts &&
                            Profile?.Posts.LatestPosts
                                ? Profile?.Posts.LatestPosts.concat(
                                      Posts.LatestPosts
                                  )
                                : Posts.LatestPosts,
                    },
                })

                if (Posts?.totalpostcount > 10) {
                    updateState(component, 'pagination', {
                        total_page: Math.ceil(Posts.totalpostcount / 10),
                    })
                }
            } else {
                setDialog({ isDialogActive: true, status, message })
            }
        } catch (error) {
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            component.setState({ isPostsDownloading: false })
        }
    }

    getLatestPostsOfUser = async (userid, targetpagenumber = 1) => {
        const user_id = userid || this.props.match.params.userid

        const url = `${API_DIRECTORY}/getLatestPostsOfUser`
        const payload = { user_id, targetpagenumber }

        await this.fetchPosts(url, payload, this)
    }

    getLatestVotedPostsOfUser = async (
        userid,
        targetpagenumber = 1,
        isUpvote
    ) => {
        const user_id = userid || this.props.match.params.userid

        const url = `${API_DIRECTORY}/getLatestVotedPostsOfUser`
        const payload = { user_id, targetpagenumber, isUpvote }

        await this.fetchPosts(url, payload, this)
    }

    getLatestAttendenceEventsOfUser = async (userid, targetpagenumber = 1) => {
        const user_id = userid || this.props.match.params.userid

        const url = `${API_DIRECTORY}/getLatestAttendenceEventsOfUser`
        const payload = { user_id, targetpagenumber }

        await this.fetchPosts(url, payload, this)
    }

    getProfile = async (userid, targetpagenumber) => {
        const user_id = userid ? userid : this.props.match.params.userid
        const { setDialog, User } = this.props

        try {
            // Shows user a loading animation.
            this.setState({ isUserDownloading: true })

            const url = `${API_DIRECTORY}/getProfile/${user_id}`
            const body = JSON.stringify({
                targetpagenumber: targetpagenumber ? targetpagenumber : 1,
            })

            const responseProfile = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json; charset=UTF-8',
                },
                body,
                credentials: 'include',
            })

            const { status, message, Profile } = responseProfile

            if (status === 'success') {
                this.setState({ Profile })

                this.getLatestPostsOfUser(Profile?.User?.user_id, 1)
                if (User.id === Profile.User.user_id) {
                    this.getFollowedHashtags()
                    this.getReminderEvents()
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
            this.setState({ isUserDownloading: false })
        }
    }

    getFollowedHashtags = async () => {
        const url = `${API_DIRECTORY}/getFollowedHashtags`

        const responseFollowedHashtags = await fetchWithErrorHandling(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include',
        })
        const { status, FollowedHashtags } = responseFollowedHashtags
        if (status === 'success') {
            this.setState({
                FollowedHashtags,
            })
        }
    }

    getReminderEvents = async () => {
        const url = `${API_DIRECTORY}/getReminderEvents`

        const responseReminderEvents = await fetchWithErrorHandling(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            },
            credentials: 'include',
        })
        const { status, ReminderEvents } = responseReminderEvents
        if (status === 'success') {
            this.setState({
                ReminderEvents,
            })
        }
    }

    resetPagination = () => {
        updateState(this, 'pagination', { current_page: 1, total_page: 1 })
    }

    uploadPhoto = async () => {
        const { setDialog } = this.props

        try {
            // Shows user a loading animation.
            this.setState({ isUserDownloading: true })

            // Uses FormData with default constructor to ensure the order of the fields and files.
            // Formidable expects text fields to appear before the file field.
            let form_data = new FormData()
            // Gets the uploaded photo from the form and append it to form data as an optional field.
            const profilePhoto = this.profilePhotoRef?.current
            if (profilePhoto.files.length) {
                form_data.append('profile_photo', profilePhoto.files[0])
            }

            const url = `${API_DIRECTORY}/changeProfilePhoto`
            const body = form_data

            const responseChangeProfilePhoto = await fetchWithErrorHandling(
                url,
                {
                    method: 'POST',
                    body,
                    credentials: 'include',
                }
            )
            const { status, message } = responseChangeProfilePhoto
            if (status === 'success') {
                this.getProfile()
            }
            // Displays custom success/error/warning message from server response.
            setDialog({
                isDialogActive: true,
                status,
                message,
            })
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        } finally {
            // Removes the loading animation from the page.
            this.setState({ isUserDownloading: false })
        }
    }

    handleAddPhoto = () => {
        this.profilePhotoRef.current.click()
    }

    handleSelectPhoto = () => {
        const { setDialog } = this.props

        const input = this.profilePhotoRef?.current // Gets selected photo and assigns to a variable.
        const file = input?.files[0] // Checks for null/undefined. Ensures a single file by getting the first photo.

        // Checks if there is a photo or not.
        if (!file) {
            updateState(this, 'inputPhoto', { isPhotoSelected: false })
            return
        }

        // Checks the file extension for the selected photo.
        if (!validFileType(file)) {
            setDialog({
                isDialogActive: true,
                status: 'error',
                message:
                    'Dosya tipi geçerli değil. Lütfen seçiminizi değiştirin.',
            })
            updateState(this, 'inputPhoto', { isPhotoSelected: false })
            return
        }

        // Limits the max file size of 10 MB for the selected photo.
        if (file.size > 10 * 1048576) {
            setDialog({
                isDialogActive: true,
                status: 'error',
                message:
                    "Seçilen fotoğrafın boyutu 10 MB'ı aşamaz. Lütfen seçiminizi değiştirin.",
            })
            updateState(this, 'inputPhoto', { isPhotoSelected: false })
            return
        }

        // Updates state with valid photo details.
        updateState(this, 'inputPhoto', {
            isPhotoSelected: true,
            photoName: file.name,
            photoSize: getReadableFileSize(file.size),
            photoUrl: window.URL.createObjectURL(file),
        })

        this.uploadPhoto()
    }

    handleOpenPhotoInModal = () => {
        const { setModal } = this.props
        const { user_photo } = this.state.Profile.User

        if (user_photo) {
            setModal({
                isModalActive: true,
                photoLink: user_photo,
            })
        }
    }

    handleShowMorePosts = () => {
        if (this.state.selectcriteria === 'own') {
            this.getLatestPostsOfUser(
                null,
                this.state.pagination.current_page + 1
            )
        } else if (this.state.selectcriteria === 'upvoted') {
            this.getLatestVotedPostsOfUser(
                null,
                this.state.pagination.current_page + 1,
                1
            )
        } else if (this.state.selectcriteria === 'downvoted') {
            this.getLatestVotedPostsOfUser(
                null,
                this.state.pagination.current_page + 1,
                0
            )
        }
        updateState(this, 'pagination', {
            current_page: this.state.pagination.current_page + 1,
        })
    }

    handleSelectPostsCriteria = (e) => {
        const criteria = e.currentTarget.value
        this.resetPagination()
        this.setState(
            {
                selectcriteria: criteria,
                Profile: {
                    ...this.state.Profile,
                    Posts: {
                        LatestPosts: null,
                    },
                },
            },
            () => {
                if (criteria === 'own') {
                    this.getLatestPostsOfUser(null, 1)
                } else if (criteria === 'upvoted') {
                    this.getLatestVotedPostsOfUser(null, 1, 1)
                } else if (criteria === 'downvoted') {
                    this.getLatestVotedPostsOfUser(null, 1, 0)
                } else if (criteria === 'attendance') {
                    this.getLatestAttendenceEventsOfUser(null, 1, 0)
                }
            }
        )
    }

    handleClickHashtag = async (hashtagID) => {
        const { setDialog } = this.props

        const url = `${API_DIRECTORY}/followHashtag`
        const body = JSON.stringify({
            hashtag_id: hashtagID,
        })

        const responsefollowHashtag = await fetchWithErrorHandling(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            },
            body,
            credentials: 'include',
        })
        // Displays custom success/error/warning message from server response.
        setDialog({
            isDialogActive: true,
            status: responsefollowHashtag.status,
            message: responsefollowHashtag.message,
        })
        this.getFollowedHashtags()
        this.getReminderEvents()
    }

    handleClickReminder = async (eventID) => {
        const { setDialog } = this.props

        const url = `${API_DIRECTORY}/declareEventAttendance`
        const body = JSON.stringify({
            topic_id: eventID,
        })
        const responseDeclareAttendance = await fetchWithErrorHandling(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json; charset=UTF-8',
            },
            body,
            credentials: 'include',
        })

        // Displays custom error/warning message from server response.
        setDialog({
            isDialogActive: true,
            status: responseDeclareAttendance.status,
            message: responseDeclareAttendance.message,
        })
        this.getFollowedHashtags()
        this.getReminderEvents()
    }

    // Render helper functions begin.
    renderSkeletonUser = () => {
        return (
            <div className="profile-user-container">
                <div className="profile-photo-skeleton"></div>
                <div className="profile-username-skeleton"></div>
                <div className="profile-latestposts-title">Son gönderileri</div>
            </div>
        )
    }

    renderProfilePhoto = () => {
        const { Profile } = this.state

        const myImage = myCloudinary.image(Profile?.User?.user_photo)
        myImage
            .resize(fill().width(80).height(80))
            .roundCorners(byRadius(max))
            .backgroundColor('#E6E2E3')

        return Profile?.User?.user_photo ? (
            <div
                className="profile-photo"
                onClick={this.handleOpenPhotoInModal}
            >
                <AdvancedImage
                    width="100%"
                    height="auto"
                    cldImg={myImage}
                    alt="Profil Foto"
                />
            </div>
        ) : null
    }

    renderActions = () => {
        const currentUser = this.props.User
        const { Profile, FollowedHashtags, ReminderEvents } = this.state

        return (
            currentUser?.id === Profile?.User?.user_id && (
                <>
                    <div className="profile-btn-addphoto-container">
                        <div
                            className="profile-btn-addphoto"
                            onClick={this.handleAddPhoto}
                        >
                            Fotoğrafı Değiştir
                        </div>
                        <form className="profile-form">
                            <input
                                name="profile_photo"
                                className="profile-addphoto"
                                ref={this.profilePhotoRef}
                                onChange={this.handleSelectPhoto}
                                type="file"
                                accept="image/*"
                            />
                        </form>
                    </div>
                    <div className="profile-followedhashtags-container">
                        <div className="profile-followedhashtag-text">
                            {FollowedHashtags && FollowedHashtags.length
                                ? 'Takip ettiklerin:'
                                : 'Takip ettiğin etiket yok. Etkinlik sayfalarından etiketleri takip edebilirsin.'}
                        </div>
                        {FollowedHashtags?.map(({ hashtag_id, Hashtag }) => (
                            <div
                                key={`hashtag${hashtag_id}`}
                                className="profile-followedhashtag"
                                onClick={() =>
                                    this.handleClickHashtag(hashtag_id)
                                }
                            >
                                {Hashtag.hashtag_name}
                            </div>
                        ))}
                        {FollowedHashtags && FollowedHashtags.length > 0 && (
                            <div className="profile-followedhashtag-text">
                                (Etikete tıklayıp takibi bırakabilirsin.)
                            </div>
                        )}
                    </div>
                    <div className="profile-reminderevents-container">
                        <div className="profile-reminderevents-text">
                            {ReminderEvents && ReminderEvents.length
                                ? 'Hatırlatma istediklerin:'
                                : 'İstediğin hatırlatma yok. Etkinlik sayfalarından hatırlatma isteyebilirsin.'}
                        </div>
                        {ReminderEvents?.map(({ event_id, Topic }) => (
                            <div
                                key={`reminder${event_id}`}
                                className="profile-reminderevents"
                                onClick={() =>
                                    this.handleClickReminder(event_id)
                                }
                            >
                                {Topic.topic_title}
                            </div>
                        ))}
                        {ReminderEvents && ReminderEvents.length > 0 && (
                            <div className="profile-reminderevents-text">
                                (Etikete tıklayıp hatırlatmayı kaldırabilirsin.)
                            </div>
                        )}
                    </div>
                </>
            )
        )
    }

    renderUserArea = () => {
        const { isUserDownloading, Profile } = this.state

        return isUserDownloading ? (
            this.renderSkeletonUser()
        ) : (
            <div className="profile-user-container">
                <div
                    className="profile-photo"
                    onClick={this.handleOpenPhotoInModal}
                >
                    {this.renderProfilePhoto()}
                </div>
                <div className="profile-username">
                    {Profile?.User?.user_name}
                </div>
                {this.renderActions()}
            </div>
        )
    }

    renderSkeletonPosts = () => {
        return [...Array(3)].map((_, i) => (
            <div className="profile-posts-skeleton-container" key={i}>
                <div className="topic-title-container">
                    <div className="topic-title-wrapper">
                        <h1 className="topic-title-skeleton"></h1>
                    </div>
                </div>
                <div className="profile-singlepost-container">
                    <span className="singlepost-text-container">
                        <span className="singlepost-text-skeleton"></span>
                    </span>
                    <div className="singlepost-bottom-container">
                        <div className="singlepost-leftmenu-container">
                            <div className="singlepost-leftmenu-wrapper">
                                <div className="singlepost-upvote-container">
                                    <img
                                        className="singlepost-upvote"
                                        src={iconAngleUp}
                                        alt={iconAngleUp}
                                    />
                                    <span className="singlepost-vote-upvotecount-skeleton"></span>
                                </div>
                                <div className="singlepost-downvote-container">
                                    <img
                                        className="singlepost-downvote"
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
                            <span className="singlepost-username-skeleton"></span>
                        </div>
                    </div>
                </div>
            </div>
        ))
    }

    renderPosts = () => {
        const { LatestPosts } = this.state.Profile.Posts

        return (
            <div className="profile-latestposts-posts">
                {LatestPosts?.map((Post) => (
                    <div key={`post-id-${Post.post_id}`}>
                        <Link to={`/topic/${Post.Topic.topic_id}`}>
                            <div className="topic-title-container">
                                <div className="topic-title-wrapper">
                                    <h1 className="topic-title">
                                        {Post.Topic.topic_title}
                                        {Post.Topic.Category.isEvent === 0 &&
                                            ` (${Post.Topic.Category.category_name})`}
                                    </h1>
                                </div>
                            </div>
                        </Link>
                        <SinglePost Post={Post} getProfile={this.getProfile} />
                    </div>
                ))}
            </div>
        )
    }

    renderPostsArea = () => {
        const { isPostsDownloading, Profile, pagination, selectcriteria } =
            this.state

        return isPostsDownloading ? (
            this.renderSkeletonPosts()
        ) : (
            <>
                <div className="profile-posts-container">
                    <div className="profile-selectcriteria-container">
                        <select
                            className="profile-selectcriteria-dropdown"
                            onChange={this.handleSelectPostsCriteria}
                            value={selectcriteria}
                        >
                            <option value="own">Son gönderileri</option>
                            <option value="upvoted">Son iyi oyladıkları</option>
                            <option value="downvoted">
                                Son kötü oyladıkları
                            </option>
                            <option value="attendance">
                                Katıldığı etkinlikler
                            </option>
                        </select>
                        <img
                            className="profile-selectcriteria-icon"
                            src={iconCaretDown}
                            alt={iconCaretDown}
                        />
                    </div>
                    <div
                        className="profile-postarea"
                        style={{
                            display: Profile?.Posts?.LatestPosts?.length
                                ? 'flex'
                                : 'none',
                        }}
                    >
                        {this.renderPosts()}
                        <div className="profile-posts-button-showmore-container">
                            <input
                                className="profile-posts-button-showmore"
                                type="button"
                                value="Daha fazla göster"
                                onClick={this.handleShowMorePosts}
                                style={{
                                    display:
                                        pagination.current_page ===
                                        pagination.total_page
                                            ? 'none'
                                            : 'block',
                                }}
                            />
                        </div>
                    </div>
                    <div className="profile-posts-notfound-container">
                        <span
                            className="profile-posts-notfound"
                            style={{
                                display: Profile.Posts?.LatestPosts?.length
                                    ? 'none'
                                    : 'block',
                            }}
                        >
                            Aradığınız kriterlere uygun sonuç bulunamadı.
                        </span>
                    </div>
                </div>
            </>
        )
    }
    // Render helper functions end.

    render() {
        const { userid } = this.props.match.params
        const { Profile } = this.state
        if (!Profile || !Object.keys(Profile).length || !userid) return null

        return (
            <>
                {Profile.User?.user_name && (
                    <Helmet>
                        <title>{`${Profile.User.user_name} | Şallı Turna`}</title>
                        <meta name="robots" content="noindex"></meta>
                    </Helmet>
                )}
                <div className="profile-container">
                    {this.renderUserArea()}
                    {this.renderPostsArea()}
                </div>
            </>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(Profile)
