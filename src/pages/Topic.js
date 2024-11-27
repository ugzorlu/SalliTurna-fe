import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
// import AdSense from 'react-adsense'
import isEqual from 'react-fast-compare'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
dayjs.locale('tr')

/* Pages */
import Venue from './Venue'

/* Internal Components */
import Spinner from '../components/Spinner'
import SinglePost from '../components/SinglePost'
import { TitleHelmet, EventHelmet, HELMET_PRIORITY } from '../components/Helmet'

/* Constants and Helpers */
import { API_DIRECTORY, CITY_ID } from '../utils/constants'
import {
    validFileType,
    getReadableFileSize,
    updateState,
    fetchWithErrorHandling,
    checkUserLoggedinStatus,
} from '../utils/commons'
import {
    PostFormValidators,
    resetValidators,
    updateValidators,
    updateStateAndValidate,
    isFormValid,
} from '../utils/validators'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import iconCaretDown from '../assets/fontawesome/caret-down-solid.svg'
import iconAngleUp from '../assets/fontawesome/angle-up-solid.svg'
import iconAngleDown from '../assets/fontawesome/angle-down-solid.svg'
import iconShareNodes from '../assets/fontawesome/share-nodes-solid.svg'
import iconCamera from '../assets/fontawesome/camera-solid.svg'
import iconMapLocationDot from '../assets/fontawesome/map-location-dot-solid.svg'
import iconCalendarDays from '../assets/fontawesome/calendar-days-solid.svg'
import iconClock from '../assets/fontawesome/clock-solid.svg'
import '../styles/Topic.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        User: state.user,
    }
}
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class PostForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            inputText: '',
            inputPhoto: {
                isPhotoIconClicked: false,
                isPhotoSelected: false,
                isPhotoTypeValid: false,
                photoName: '',
                photoSize: 0,
                photoUrl: '',
            },
            isFormUploading: false,
        }

        this.topictextareaRef = createRef()
        this.uploadphotoRef = createRef()

        this.validators = PostFormValidators
        resetValidators(this.validators)
    }

    componentDidUpdate(prevProps) {
        const { User, location } = this.props

        // Checks if there is a user login change or page change.
        const didPropsChanged =
            location.pathname !== prevProps.location.pathname ||
            !isEqual(User, prevProps.User)

        if (didPropsChanged) {
            this.resetState()
        }
    }

    resetState = () => {
        this.setState({
            inputText: '',
            inputPhoto: {
                isPhotoIconClicked: false,
                isPhotoSelected: false,
                isPhotoTypeValid: false,
                photoName: '',
                photoSize: 0,
                photoUrl: '',
            },
            isFormUploading: false,
        })
    }

    handleInputChange = (e, inputPropName, objectName = null) => {
        updateStateAndValidate(
            this,
            e,
            inputPropName,
            objectName,
            updateValidators
        )
    }

    handleAddSpoiler = () => {
        // Gets the post area of the current topic.
        const textarea = this.topictextareaRef?.current
        // Ensures the ref exists and points to a valid text area element.
        if (!(textarea instanceof HTMLTextAreaElement)) {
            return
        }

        let wholetext = textarea.value
        const { selectionStart, selectionEnd } = textarea

        // Ensures they are valid indices and in a correct selection range.
        if (
            typeof selectionStart !== 'number' ||
            typeof selectionEnd !== 'number' ||
            selectionStart < 0 ||
            selectionEnd < 0 ||
            selectionStart > selectionEnd
        ) {
            return
        }

        const selectedText = wholetext.slice(selectionStart, selectionEnd)
        const spoilerContent = selectedText || '' // Empty placeholder if nothing is selected.

        // Constructs the new text with spoiler markers.
        const newtext =
            wholetext.slice(0, selectionStart) +
            `—Spoiler—\n\n${spoilerContent}\n\n—Spoiler—` +
            wholetext.slice(selectionEnd)

        // Updates the state with the modified text content.
        this.setState({ inputText: newtext })
    }

    handleOpenPhotoList = () => {
        // Mimicks a click to an invisible upload photo button.
        this.uploadphotoRef?.current.click()

        // Makes upload photo preview area visible.
        updateState(this, 'inputPhoto', { isPhotoIconClicked: true })
    }

    handleSelectPhoto = () => {
        const { setDialog } = this.props

        const input = this.uploadphotoRef?.current // Gets selected photo and assigns to a variable.
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
    }

    insertPost = async (e) => {
        e.preventDefault()
        const { User, setDialog } = this.props

        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) {
            return
        }

        if (isFormValid(this.validators)) {
            // Uses FormData with default constructor to ensure the order of the fields and files.
            // Formidable expects text fields to appear before the file field.
            let form_data = new FormData()

            // Appends Topic ID related to the post.
            form_data.append('topic_id', this.props.topicid)

            // Gets the posted text from the form and append it to form data as a required field.
            const topicTextarea = this.topictextareaRef?.current
            if (topicTextarea && topicTextarea.value.trim() !== '') {
                form_data.append('post_text', topicTextarea.value.trim())
            } else {
                // Shows user custom error message for post field if validators fail.
                setDialog({
                    isDialogActive: true,
                    status: 'error',
                    message: 'Alan boş bırakılamaz.',
                })
                return
            }

            // Gets the uploaded file from the form and append it to form data as an optional field.
            const topicUploadPhoto = this.uploadphotoRef?.current
            if (topicUploadPhoto.files.length) {
                form_data.append('post_photo', topicUploadPhoto.files[0])
            }

            try {
                // Shows user a loading animation.
                this.setState({ isFormUploading: true })

                // Inserts new post to the db.
                const url = `${API_DIRECTORY}/insertPost`
                const responseInsertPost = await fetchWithErrorHandling(url, {
                    method: 'POST',
                    body: form_data,
                    credentials: 'include',
                })
                if (responseInsertPost.status === 'success') {
                    // Re-renders the topic list with the addition of this post.
                    this.props.handleInsertPost()
                    // Makes the upload photo preview area not rendered.
                    updateState(this, 'inputPhoto', {
                        isPhotoIconClicked: false,
                    })
                    this.uploadphotoRef.current.value = '' // Clears the uploaded photo from input.
                    this.setState({ inputText: '' }) // Clears the text area.
                }
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseInsertPost.status,
                    message: responseInsertPost.message,
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
                this.setState({ isFormUploading: false })
            }
        }
    }

    // Render helper functions begin.
    renderSpinner = () => {
        const { isFormUploading } = this.state

        if (!isFormUploading) return null
        return (
            <div className="topic-spinner">
                <Spinner />
            </div>
        )
    }
    renderTextarea = () => {
        const { topic_title } = this.props.topic
        const { inputText } = this.state

        return (
            <div className="topic-form-textarea-container">
                <textarea
                    className="topic-textarea"
                    name="post_text"
                    value={inputText}
                    ref={this.topictextareaRef}
                    placeholder={`${topic_title} hakkında paylaşımda bulunun.`}
                    rows="10"
                    onInvalid={(e) => this.handleInputChange(e, 'inputText')}
                    onChange={(e) => this.handleInputChange(e, 'inputText')}
                    required
                />
            </div>
        )
    }
    renderPhotoPreview = () => {
        const { inputPhoto } = this.state
        const {
            isPhotoIconClicked,
            isPhotoSelected,
            photoName,
            photoSize,
            photoUrl,
        } = inputPhoto

        if (!isPhotoIconClicked) return null

        return (
            <div className="topic-form-uploadphoto-container">
                <div className="topic-form-uploadphoto-info-wrapper">
                    <span>
                        {isPhotoSelected
                            ? 'Seçiminizi değiştirmek için ikona tekrar tıklayın.'
                            : 'Seçili fotoğraf yok'}
                    </span>
                </div>
                <div className="topic-form-uploadphoto-preview-container">
                    {isPhotoSelected && (
                        <div className="topic-form-uploadphoto-preview-wrapper">
                            <img
                                className="topic-form-uploadphoto-preview-image"
                                src={photoUrl}
                                alt="Preview"
                            />
                        </div>
                    )}
                    <span
                        className={`topic-form-uploadphoto-preview-info ${
                            isPhotoSelected
                                ? 'topic-form-uploadphoto-preview-success'
                                : 'topic-form-uploadphoto-preview-error'
                        }`}
                    >
                        {isPhotoSelected ? `${photoName}, ${photoSize}.` : ''}
                    </span>
                </div>
            </div>
        )
    }

    renderButtons = () => (
        <div className="topic-form-buttons-container">
            <div className="topic-form-buttons-wrapper topic-form-buttons-wrapper-left">
                <div
                    className="topic-form-button-uploadphoto-container"
                    onClick={this.handleOpenPhotoList}
                >
                    <div
                        className="topic-form-button-uploadphoto-wrapper"
                        onClick={this.handleOpenPhotoList}
                    >
                        <img
                            className="topic-form-button-uploadphoto-icon"
                            src={iconCamera}
                            alt={iconCamera}
                        />
                    </div>
                    <div className="topic-form-button-uploadphoto-text">
                        Fotoğraf Ekle
                    </div>
                    <input
                        type="file"
                        className="topic-form-button-uploadphoto-invisible"
                        name="post_photo"
                        ref={this.uploadphotoRef}
                        onChange={this.handleSelectPhoto}
                        accept="image/*"
                    />
                </div>
                <div className="topic-button-wrapper">
                    <input
                        className="topic-button-addspoiler"
                        type="button"
                        value="Spoiler Ekle"
                        onClick={this.handleAddSpoiler}
                    />
                </div>
            </div>
            <div className="topic-form-buttons-wrapper topic-form-buttons-wrapper-right">
                <div className="topic-button-wrapper">
                    <input
                        className="topic-button-send"
                        type="submit"
                        value="Gönder"
                    />
                </div>
            </div>
        </div>
    )
    // Render helper functions end.

    render() {
        return (
            <form
                className="topic-form"
                encType="multipart/form-data"
                onSubmit={this.insertPost}
            >
                {this.renderSpinner()}
                {this.renderTextarea()}
                {this.renderPhotoPreview()}
                {this.renderButtons()}
            </form>
        )
    }
}
// Connects component to Redux and exports with React Router.
const ConnectedPostForm = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PostForm)
)

class Topic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Topic: null,
            Posts: [],
            pagination: {
                isPagingHidden: true,
                current_page: 1,
                total_page: 1,
            },
            totalpostcount: 0,
            orderby: 'old',
            isTitleDownloading: false,
            isPostsDownloading: false,
        }
    }

    componentDidMount() {
        if (this.props.User.id !== null) {
            this.getTopic()
            this.getPosts()
        }
    }
    componentDidUpdate(prevProps) {
        const { User, location } = this.props

        // Checks if there is a user login change or page change.
        const didPropsChanged =
            location.pathname !== prevProps.location.pathname ||
            !isEqual(User, prevProps.User)

        if (didPropsChanged) {
            this.resetState()
            this.getTopic()
            this.getPosts()
            this.setState({
                pagination: {
                    isPagingHidden: true,
                    current_page: 1,
                    total_page: 1,
                },
            })
        }
    }

    resetState = () => {
        this.setState({
            Topic: null,
            Posts: [],
            pagination: {
                isPagingHidden: true,
                current_page: 1,
                total_page: 1,
            },
            totalpostcount: 0,
            orderby: 'old',
            isTitleDownloading: false,
            isPostsDownloading: false,
        })
    }

    getTopic = async () => {
        try {
            const { setDialog } = this.props

            // Shows user a loading animation.
            this.setState({ isTitleDownloading: true })

            // Gets topic from db.
            const url = `${API_DIRECTORY}/getTopic/${this.props.match.params.topicid}`
            const responseTopic = await fetchWithErrorHandling(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            const { status, message, Topic } = responseTopic
            if (status === 'success') {
                // Populates state with response data.
                this.setState({ Topic })
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
            this.setState({ isTitleDownloading: false })
        }
    }

    getPosts = async (targetpagenumber) => {
        const { setDialog } = this.props

        try {
            // Shows user a loading animation.
            this.setState({ isPostsDownloading: true })

            // Gets posts and total post count from db by using pagination.
            const url = `${API_DIRECTORY}/getPosts/${this.props.match.params.topicid}`
            const responsePostList = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({
                    targetpagenumber: targetpagenumber,
                    orderby: this.state.orderby,
                }),
                credentials: 'include',
            })

            // Populates states with response data.
            if (responsePostList.status === 'success') {
                const { Posts, totalpostcount } = responsePostList
                this.setState({ Posts: Posts, totalpostcount: totalpostcount })

                // Shows page numbers to the user if it's more than one page.
                if (totalpostcount > 10) {
                    updateState(this, 'pagination', {
                        isPagingHidden: false,
                        total_page: Math.ceil(totalpostcount / 10),
                    })
                }
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responsePostList.status,
                    message: responsePostList.message,
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
            this.setState({ isPostsDownloading: false })
        }
    }

    resetPagination = () => {
        // Resets page number to the default and removes page numbers from the page.
        updateState(this, 'pagination', {
            isPagingHidden: true,
            current_page: 1,
            total_page: 1,
        })
    }

    updateCurrentPage(newPage) {
        const { total_page } = this.state.pagination

        // Ensures the new page is within valid bounds.
        if (newPage < 1 || newPage > total_page) {
            return
        }

        // Updates current page number by saving it to the correspondent state.
        updateState(this, 'pagination', { current_page: newPage })

        // Fetchs posts after updating the page number.
        this.getPosts(newPage)
    }
    handleClickPaginationNextPage = () => {
        const { current_page } = this.state.pagination
        this.updateCurrentPage(current_page + 1)
    }
    handleClickPaginationPreviousPage = () => {
        const { current_page } = this.state.pagination
        this.updateCurrentPage(current_page - 1)
    }
    handleClickPaginationFinalPage = () => {
        const { total_page } = this.state.pagination
        this.updateCurrentPage(total_page)
    }
    // TODO feature
    //handleClickPaginationCustomPage = () => {}

    handleInsertPost = (e) => {
        // Checks if page is full of pre-defined number of posts per page.
        const { pagination, totalpostcount } = this.state
        const isPageFull = totalpostcount % 10 === 0

        // Assigns the new post to the correspondent (current or new) page and updates state accordingly.
        const newTargetPage = isPageFull
            ? pagination.total_page + 1
            : pagination.total_page
        updateState(this, 'pagination', { current_page: newTargetPage })

        // Re-renders the leftframe with the addition of this post.
        // BUG: Does not render correctly.
        // this.props.updateLeftFrame()

        // Shows all the posts (including the new one) from the correspondent page.
        this.getPosts(newTargetPage)
    }

    handleSelectOrderby = async (e) => {
        // Ensures the new order is valid. Does nothing if it's not.
        const newOrderby = e.currentTarget?.value
        if (typeof newOrderby !== 'string') {
            return
        }

        // Shows the posts according to the new order.
        this.setState({ orderby: newOrderby }, () => {
            this.resetPagination()
            this.getPosts()
        })
    }

    handleClickAttendanceDeclaration = async (e) => {
        const { User, setDialog } = this.props
        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) {
            return
        }

        const { topic_id, totalAttendance, isUserAnAttandee } = this.state.Topic

        try {
            // Sets user's attendance declaration status to the current event.
            const responseDeclareEventAttendance = await fetchWithErrorHandling(
                `${API_DIRECTORY}/declareEventAttendance`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({ topic_id }),
                    credentials: 'include',
                }
            )
            if (responseDeclareEventAttendance.status === 'success') {
                // Shows event area changes according to user's declaration.
                updateState(this, 'Topic', {
                    totalAttendance: isUserAnAttandee
                        ? totalAttendance - 1
                        : totalAttendance + 1,
                    isUserAnAttandee: !isUserAnAttandee,
                })
            }
            // Displays custom error/warning message from server response.
            setDialog({
                isDialogActive: true,
                status: responseDeclareEventAttendance.status,
                message: responseDeclareEventAttendance.message,
            })
        } catch (error) {
            // Displays error messages from fetch helper function.
            setDialog({
                isDialogActive: true,
                status: 'error',
                message: error.message,
            })
        }
    }

    handleClickHashtag = async (e) => {
        const { User, setDialog } = this.props
        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) {
            return
        }

        const selectedHashtag = e.currentTarget
        const hashtagId = selectedHashtag.dataset.hashtagid
        try {
            // Sets user's following status of clicked hashtag.
            const responseFollowHashtag = await fetchWithErrorHandling(
                `${API_DIRECTORY}/followHashtag`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body: JSON.stringify({ hashtag_id: hashtagId }),
                    credentials: 'include',
                }
            )
            if (responseFollowHashtag.status === 'success') {
                // Shows the changes in hashtag following by changing the button's styling.
                selectedHashtag.classList.toggle(
                    'topic-hashtag-active-container'
                )
            }
            // Shows user custom return message according to any response.
            setDialog({
                isDialogActive: true,
                status: responseFollowHashtag.status,
                message: responseFollowHashtag.message,
            })
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
    getEventSchemaJson = (topic) => ({
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: topic.topic_title,
        startDate: topic.start_date,
        endDate: topic.end_date || null,
        eventAttendanceMode:
            topic.City?.city_id === CITY_ID.ONLINE
                ? 'OnlineEventAttendanceMode'
                : 'OfflineEventAttendanceMode',
        location:
            topic.City?.city_id === CITY_ID.ONLINE
                ? {
                      '@type': 'VirtualLocation',
                      url: topic.source_link || null,
                  }
                : {
                      '@type': 'Place',
                      name: topic.Venue?.venue_title || null,
                      address: {
                          '@type': 'PostalAddress',
                          addressRegion: topic.Venue?.venue_title || null,
                      },
                  },
    })
    setMetadata = () => {
        const { Topic } = this.state
        const eventJSON = Topic.Category?.isEvent
            ? this.getEventSchemaJson(Topic)
            : false

        return (
            <>
                <TitleHelmet
                    title={`${Topic.topic_title} | Şallı Turna`}
                    priority={HELMET_PRIORITY.HIGH}
                />
                {Topic.Category?.isEvent && eventJSON ? (
                    <EventHelmet
                        event={eventJSON}
                        priority={HELMET_PRIORITY.HIGH}
                    />
                ) : null}
            </>
        )
    }

    renderTitle = (title, category) => {
        const { topicid } = this.props.match.params

        if (!title) return null
        return (
            <h1 key={topicid} className="topic-title">
                {title} {category && `(${category})`}
            </h1>
        )
    }
    renderVenue = (venue) => {
        if (!venue) return null
        return (
            <span className="topic-venue-wrapper">
                <img
                    className="topic-venue-icon"
                    src={iconMapLocationDot}
                    alt={iconMapLocationDot}
                />
                <span className="topic-venue">{venue.venue_title}</span>
            </span>
        )
    }
    renderDateTime = (start, end) => {
        if (!start) return null

        const clockFormat = 'HH:mm'
        const dayFormat = 'D'
        const shortFormat = 'D MMMM'
        const longFormat = 'D MMMM YYYY'
        const fullFormat = 'D MMMM YYYY dddd'

        const startDay = dayjs(start)
        const endDay = end ? dayjs(end) : null

        const isSameDay = endDay && startDay.isSame(endDay, 'day')
        const isSameMonth = endDay && startDay.isSame(endDay, 'month')

        let formattedDate
        if (endDay) {
            if (isSameDay) {
                formattedDate = startDay.format(fullFormat)
            } else if (isSameMonth) {
                formattedDate = `${startDay.format(
                    dayFormat
                )} - ${endDay.format(longFormat)}`
            } else {
                formattedDate = `${startDay.format(
                    shortFormat
                )} - ${endDay.format(longFormat)}`
            }
        } else {
            formattedDate = startDay.format(fullFormat)
        }

        return (
            <span className="topic-time-wrapper">
                <span className="topic-date-wrapper">
                    <img
                        className="topic-date-icon"
                        src={iconCalendarDays}
                        alt={iconCalendarDays}
                    />
                    <span className="topic-date">{formattedDate}</span>
                </span>
                <span className="topic-clock-wrapper">
                    <img
                        className="topic-clock-icon"
                        src={iconClock}
                        alt={iconClock}
                    />
                    <span className="topic-clock">
                        {startDay.format(clockFormat)}
                    </span>
                </span>
            </span>
        )
    }
    renderTitleArea = () => {
        const { Topic, isTitleDownloading } = this.state
        const { topic_title, Category, Venue, start_date, end_date } = Topic
        const { isEvent, category_name } = Category

        return (
            <>
                <div className="rekl-container">
                    {/* <AdSense.Google
                        className="adsbygoogle"
                        client='ca-pub-5093736351800898'
                        slot='5013158262'
                        layout='in-article'
                        format='fluid'
                        /> 
                        
                        <ins className="adsbygoogle"
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-5093736351800898"
                        data-ad-slot="5013158262">
                        </ins>
                        */}
                </div>
                <div className="topic-title-container">
                    <div className="topic-title-wrapper">
                        {isTitleDownloading ? (
                            <h1 className="topic-title-skeleton"></h1>
                        ) : (
                            <>
                                {this.renderTitle(
                                    topic_title,
                                    isEvent === 0 ? category_name : null
                                )}
                                <div className="topic-info-container">
                                    {this.renderVenue(Venue)}
                                    {this.renderDateTime(start_date, end_date)}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </>
        )
    }

    renderAttendanceArea = () => {
        const { Topic, isTitleDownloading } = this.state

        if (isTitleDownloading || Topic.Category?.isEvent !== 1) return null

        const { isUserAnAttandee, totalAttendance } = Topic

        return (
            <div className="topic-topbar-container topic-topbar-topicinfo-container">
                <div className="topic-topbar topic-topbar-topicinfo">
                    <div className="topic-attendance-container">
                        <div className="topic-attendance-count">
                            {totalAttendance}
                        </div>
                        <div className="topic-attendance-count-text">
                            &nbsp;katılımcı
                        </div>
                        <div
                            className={
                                isUserAnAttandee
                                    ? 'topic-attendance-userdeclaration-active'
                                    : 'topic-attendance-userdeclaration'
                            }
                            onClick={this.handleClickAttendanceDeclaration}
                        >
                            <div
                                className={
                                    isUserAnAttandee
                                        ? 'topic-attendance-userdeclaration-active-text'
                                        : 'topic-attendance-userdeclaration-text'
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    renderHashtag = (hashtag) => {
        const isActive = hashtag.isUserFollower
        const containerClass = isActive
            ? 'topic-hashtag-container topic-hashtag-active-container'
            : 'topic-hashtag-container'

        return (
            <div
                className={containerClass}
                key={`hashtag${hashtag.hashtag_id}`}
                data-hashtagid={hashtag.hashtag_id}
                onClick={this.handleClickHashtag}
            >
                <div className="topic-hashtag-text">
                    &nbsp;{hashtag.Hashtag.hashtag_name}
                </div>
            </div>
        )
    }
    renderHashtagArea = () => {
        const { Topic, isTitleDownloading } = this.state
        if (
            isTitleDownloading ||
            !Topic.hashtags ||
            Topic.hashtags.length === 0 ||
            Topic.Category?.isEvent !== 1
        )
            return null

        return (
            <div className="topic-topbar-container topic-topbar-hashtag-container">
                <div className="topic-topbar topic-topbar-hashtag">
                    <div className="topic-hashtags-container">
                        <div className="topic-hashtags-info">
                            Etikete tıkla ve yeni etkinliklerden anında haberdar
                            ol!
                        </div>
                        {Topic.hashtags.map((Hashtag) =>
                            this.renderHashtag(Hashtag)
                        )}
                    </div>
                </div>
            </div>
        )
    }

    renderOrderByDropdown = () => (
        <div className="topic-orderby-container">
            <select
                name="topic-orderby-dropdown"
                className="topic-orderby-dropdown"
                onChange={this.handleSelectOrderby}
            >
                <option value="old">Tarihe göre sıralı</option>
                <option value="best">Oylara göre sıralı</option>
            </select>
            <img
                className="topic-orderby-icon"
                src={iconCaretDown}
                alt={iconCaretDown}
            />
        </div>
    )
    renderPagination = (isPagingHidden, currentPage, totalPage) => (
        <div
            className="topic-paging"
            style={{ display: isPagingHidden ? 'none' : 'block' }}
        >
            <span
                className="topic-paging-page topic-paging-previouspage"
                onClick={this.handleClickPaginationPreviousPage}
            >
                &#8249;
            </span>
            <span
                className="topic-paging-page topic-paging-currentpage"
                onClick={this.handleClickPaginationCustomPage}
            >
                {currentPage}
            </span>
            /
            <span
                className="topic-paging-page topic-paging-finalpage"
                onClick={this.handleClickPaginationFinalPage}
            >
                {totalPage}
            </span>
            <span
                className="topic-paging-page topic-paging-nextpage"
                onClick={this.handleClickPaginationNextPage}
            >
                &#8250;
            </span>
        </div>
    )
    renderMenuArea = () => {
        const { pagination } = this.state
        const { isPagingHidden, current_page, total_page } = pagination

        return (
            <div className="topic-topbar-container topic-topbar-postsinfo-container">
                <div className="topic-topbar topic-topbar-postsinfo">
                    {this.renderOrderByDropdown()}
                    {this.renderPagination(
                        isPagingHidden,
                        current_page,
                        total_page
                    )}
                </div>
            </div>
        )
    }

    renderSkeletonPost = (key) => {
        return (
            <div className="singlepost-container" key={key}>
                <span className="singlepost-text-container">
                    <span className="singlepost-text-skeleton"></span>
                </span>
                <div className="singlepost-bottom-container">
                    <div className="singlepost-leftmenu-container">
                        <div className="singlepost-leftmenu-wrapper">
                            <div className="singlepost-upvote-skeleton-container">
                                <img
                                    className="singlepost-upvote"
                                    src={iconAngleUp}
                                    alt={iconAngleUp}
                                />
                                <span className="singlepost-vote-upvotecount-skeleton"></span>
                            </div>
                            <div className="singlepost-downvote-skeleton-container">
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
                        <div className="singlepost-user-wrapper">
                            <span className="singlepost-username-skeleton"></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderPostsArea = () => {
        const { Topic, Posts, isPostsDownloading } = this.state

        if (isPostsDownloading) {
            // Shows a number of animated dummy posts called skeleton posts while loading.
            return Array.from({ length: 10 }, (_, i) =>
                this.renderSkeletonPost(i)
            )
        }

        return (
            <div className="postlist-container">
                {Array.isArray(Posts) && Posts.length > 0
                    ? Posts.map((post, index) => (
                          <div key={post.post_id}>
                              <SinglePost
                                  Post={post}
                                  getPosts={this.getPosts}
                                  isPostEventsFirstPost={
                                      Topic.Category?.isEvent === 1 &&
                                      index === 0
                                  }
                              />
                              {Topic.Category?.isEvent === 1 &&
                                  Topic.source_link &&
                                  index === 0 && (
                                      <a
                                          href={Topic.source_link}
                                          target="_blank"
                                          rel="noreferrer"
                                      >
                                          <div className="topic-source-link">
                                              <div className="topic-source-link-text">
                                                  {Topic.City.city_id ===
                                                      CITY_ID.ONLINE &&
                                                  Topic.isFree
                                                      ? 'Etkinliğe Katıl'
                                                      : 'Bilgi Al'}
                                              </div>
                                          </div>
                                      </a>
                                  )}
                          </div>
                      ))
                    : null}
            </div>
        )
    }

    renderPostForm = () => {
        const { topicid } = this.props.match.params
        const { Topic } = this.state

        return (
            <ConnectedPostForm
                topicid={topicid}
                topic={Topic}
                handleInsertPost={this.handleInsertPost}
            />
        )
    }

    renderVenueArea = () => {
        const { Topic } = this.state
        return Topic.Venue ? <Venue venueid={Topic.Venue.venue_id} /> : null
    }
    // Render helper functions end.

    render() {
        const { topicid } = this.props.match.params
        const { Topic } = this.state
        if (!Topic || !topicid) return null

        return (
            <>
                {this.setMetadata()}
                <div className="topic-container">
                    {this.renderTitleArea()}
                    {this.renderAttendanceArea()}
                    {this.renderHashtagArea()}
                    {this.renderMenuArea()}
                    {this.renderPostsArea()}
                    {this.renderPostForm()}
                    {this.renderVenueArea()}
                </div>
            </>
        )
    }
}
// Connects component to Redux.
const ConnectedTopic = connect(mapStateToProps, mapDispatchToProps)(Topic)

// Exports single component.
export default ConnectedTopic
