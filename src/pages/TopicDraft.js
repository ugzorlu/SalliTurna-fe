import React, { Component, createRef, forwardRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import isEqual from 'react-fast-compare'
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import tr from 'date-fns/locale/tr'
registerLocale('tr', tr)
setDefaultLocale('tr')

/* Internal Components */
import Spinner from '../components/Spinner'

/* Constants and Helpers */
import { API_DIRECTORY } from '../utils/constants.js'
import {
    updateState,
    validFileType,
    getReadableFileSize,
    checkUserAdminStatus,
    fetchWithErrorHandling,
    checkUserLoggedinStatus,
} from '../utils/commons'
import {
    TopicFormValidators,
    resetValidators,
    updateValidators,
    updateStateAndValidate,
    isFormValid,
} from '../utils/validators'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import iconCamera from '../assets/fontawesome/camera-solid.svg'
import iconCaretDown from '../assets/fontawesome/caret-down-solid.svg'
import iconCalendarDays from '../assets/fontawesome/calendar-days-solid.svg'
import iconClock from '../assets/fontawesome/clock-solid.svg'
import '../styles/TopicDraft.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        User: state.user,
        navigation: state.navigation,
    }
}
const mapDispatchToProps = {
    setDialog,
}
// Redux functions to connect Redux store end.

class TopicForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navigation: {
                isRedirected: false,
            },
            inputTopic: {
                isEvent: false,
                categoryID: '',
                cityID: '',
                venueID: '',
                inputTitle: '',
                inputText: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                isFree: 0,
                link: '',
                hashtag: '',
            },
            inputPhoto: {
                isPhotoIconClicked: false,
                isPhotoSelected: false,
                isPhotoTypeValid: false,
                photoName: '',
                photoSize: 0,
                photoUrl: '',
            },
            VenueList: [],
            isFormUploading: false,
        }

        // Sets relevant fields from url params when page is called by search.
        const url = this.props.location.search
        if (url) {
            const urlParams = new URLSearchParams(url)
            const title = urlParams.get('title')
            const isRedirected = urlParams.get('redirected') === 'true'
            this.state = {
                ...this.state,
                inputTopic: {
                    ...this.state.inputTopic,
                    inputTitle: title || '',
                },
                navigation: { isRedirected },
            }
        }

        this.formRefs = {
            category: createRef(),
            city: createRef(),
            venue: createRef(),
            startDate: createRef(),
            startTime: createRef(),
            endDate: createRef(),
            endTime: createRef(),
            isFree: createRef(),
            title: createRef(),
            text: createRef(),
            link: createRef(),
            hashtag: createRef(),
            uploadPhoto: createRef(),
        }

        this.validators = TopicFormValidators
        resetValidators(this.validators)
    }

    componentDidUpdate(prevProps, prevState) {
        const { navigation } = this.props

        // Checks if there is a navigation search change.
        const didPropsChanged = !isEqual(
            navigation.search,
            prevProps.navigation.search
        )

        if (didPropsChanged) {
            this.resetState()
        }
    }

    resetState = () => {
        const { navigation, location } = this.props
        const { keyword } = navigation.search
        const url = location.search

        this.setState({
            navigation: {
                isRedirected: false,
            },
            inputTopic: {
                isEvent: false,
                categoryID: '',
                cityID: '',
                venueID: '',
                inputTitle: '',
                inputText: '',
                startDate: '',
                startTime: '',
                endDate: '',
                endTime: '',
                isFree: 0,
                link: '',
                hashtag: '',
            },
            inputPhoto: {
                isPhotoIconClicked: false,
                isPhotoSelected: false,
                isPhotoTypeValid: false,
                photoName: '',
                photoSize: 0,
                photoUrl: '',
            },
            VenueList: [],
            isFormUploading: false,
        })

        // Sets relevant fields from url params when page is called by search.
        if (url) {
            const urlParams = new URLSearchParams(url)
            const isRedirected = urlParams.get('redirected') === 'true'
            this.setState({ navigation: { isRedirected } })
            updateState(this, 'inputTopic', { inputTitle: keyword })
        }
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

    redirectToTopic = (topicid) => {
        this.props.history.push('/topic/' + topicid)
    }

    getVenues = async (cityid) => {
        const { setDialog } = this.props

        // Gets a venue list according to selected city.
        try {
            const url = `${API_DIRECTORY}/getVenues/${cityid}`
            const responseVenues = await fetchWithErrorHandling(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            if (responseVenues.status === 'success') {
                this.setState({ VenueList: responseVenues.VenueList[0] })
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseVenues.status,
                    message: responseVenues.message,
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

    handleOpenPhotoList = () => {
        // Mimicks a click to an invisible upload photo button.
        this.formRefs.uploadPhoto?.current.click()

        // Makes upload photo preview area visible.
        updateState(this, 'inputPhoto', { isPhotoIconClicked: true })
    }

    handleSelectPhoto = () => {
        const { setDialog } = this.props

        const input = this.formRefs.uploadPhoto?.current // Gets selected photo and assigns to a variable.
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

    handleAddSpoiler = () => {
        // Gets the post area of the current topic.
        const textarea = this.formRefs.text?.current
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
        updateState(this, 'inputTopic', { inputText: newtext })
    }

    insertTopic = async (e) => {
        e.preventDefault()

        const { User, setDialog } = this.props

        const isUserLoggedin = checkUserLoggedinStatus(User, setDialog)
        if (!isUserLoggedin) {
            return
        }

        if (isFormValid(this.validators)) {
            try {
                // Uses FormData with default constructor to ensure the order of the fields and files.
                // Formidable expects text fields to appear before the file field.
                let form_data = new FormData()

                // Gets the event status and append it to form data as a required field.
                form_data.append('is_event', this.state.inputTopic.isEvent)

                // Gets the category ID from the form and append it to form data as a required field.
                const topicDraftFormCategory = this.formRefs.category?.current
                if (
                    topicDraftFormCategory &&
                    topicDraftFormCategory.value.trim() !== '0'
                ) {
                    form_data.append(
                        'category_id',
                        topicDraftFormCategory.value.trim()
                    )
                } else {
                    // Shows user custom error message for post field if validators fail.
                    setDialog({
                        isDialogActive: true,
                        status: 'error',
                        message: 'Kategori seçmelisiniz.',
                    })
                    return
                }

                // Gets the city ID from the form and append it to form data as a required field if event.
                const { current: topicDraftFormCity } = this.formRefs.city || {}

                if (topicDraftFormCity) {
                    if (topicDraftFormCity.value.trim() !== '') {
                        form_data.append(
                            'city_id',
                            topicDraftFormCity.value.trim()
                        )
                    } else {
                        // Shows user custom error message for post field if validators fail.
                        setDialog({
                            isDialogActive: true,
                            status: 'error',
                            message: 'Etkinlik için şehir seçmelisiniz.',
                        })
                        return
                    }
                }

                // Gets the category ID from the form and append it to form data as a required field.
                const topicDraftFormVenue = this.formRefs.venue?.current
                if (
                    topicDraftFormVenue &&
                    topicDraftFormVenue.value.trim() !== '0'
                ) {
                    form_data.append(
                        'venue_id',
                        topicDraftFormVenue.value.trim()
                    )
                }

                // Gets the starting date from the form and append it to form data as a required field if event.
                const { current: topicDraftFormStartDate } =
                    this.formRefs.startDate || {}
                const startDateValue = this.state.inputTopic.startDate
                if (topicDraftFormStartDate) {
                    if (startDateValue && startDateValue !== '') {
                        form_data.append('start_date', startDateValue)
                    } else {
                        // Shows user custom error message for post field if validators fail.
                        setDialog({
                            isDialogActive: true,
                            status: 'error',
                            message:
                                'Etkinlik için başlangıç tarihi seçmelisiniz.',
                        })
                        return
                    }
                }

                // Gets the starting time from the form and append it to form data as a required field if event.
                const { current: topicDraftFormStartTime } =
                    this.formRefs.startTime || {}
                const startTimeValue = this.state.inputTopic.startTime
                if (topicDraftFormStartTime) {
                    if (startTimeValue && startTimeValue !== '') {
                        form_data.append('start_time', startTimeValue)
                    } else {
                        // Shows user custom error message for post field if validators fail.
                        setDialog({
                            isDialogActive: true,
                            status: 'error',
                            message:
                                'Etkinlik için başlangıç saati seçmelisiniz.',
                        })
                        return
                    }
                }

                // Gets the ending date from the form and append it to form data as a required field if event.
                const { current: topicDraftFormEndDate } =
                    this.formRefs.endDate || {}
                const endDateValue = this.state.inputTopic.endDate
                if (
                    topicDraftFormEndDate &&
                    endDateValue &&
                    endDateValue !== ''
                ) {
                    if (endDateValue.getTime() >= startDateValue.getTime()) {
                        form_data.append('end_date', endDateValue)
                    } else {
                        // Shows user custom error message for post field if validators fail.
                        setDialog({
                            isDialogActive: true,
                            status: 'error',
                            message:
                                'Etkinlik bitişi için ileri tarihli gün seçmelisiniz.',
                        })
                        return
                    }
                }

                // Gets the ending time from the form and append it to form data as a required field if event.
                const { current: topicDraftFormEndTime } =
                    this.formRefs.endTime || {}
                const endTimeValue = this.state.inputTopic.endTime
                if (
                    topicDraftFormEndTime &&
                    endTimeValue &&
                    endTimeValue !== ''
                ) {
                    if (
                        endDateValue.getTime() > startDateValue.getTime() ||
                        (endDateValue.getTime() === startDateValue.getTime() &&
                            endTimeValue.getTime() >= startTimeValue.getTime())
                    ) {
                        form_data.append('end_time', endTimeValue)
                    } else {
                        // Shows user custom error message for post field if validators fail.
                        setDialog({
                            isDialogActive: true,
                            status: 'error',
                            message:
                                'Etkinlik bitişi için ileri tarihli saat seçmelisiniz.',
                        })
                        return
                    }
                }

                // Gets the title from the form and append it to form data as a required field.
                const topicDraftFormTitle = this.formRefs.title?.current
                if (
                    topicDraftFormTitle &&
                    topicDraftFormTitle.value.trim() !== ''
                ) {
                    form_data.append('title', topicDraftFormTitle.value.trim())
                } else {
                    // Shows user custom error message for post field if validators fail.
                    setDialog({
                        isDialogActive: true,
                        status: 'error',
                        message: 'Başlık boş bırakılamaz.',
                    })
                    return
                }

                // Gets the posted text from the form and append it to form data as a required field.
                const topicDraftFormText = this.formRefs.text?.current
                if (
                    topicDraftFormText &&
                    topicDraftFormText.value.trim() !== ''
                ) {
                    form_data.append(
                        'post_text',
                        topicDraftFormText.value.trim()
                    )
                } else {
                    // Shows user custom error message for post field if validators fail.
                    setDialog({
                        isDialogActive: true,
                        status: 'error',
                        message: 'Gönderi boş bırakılamaz.',
                    })
                    return
                }

                // Gets the is free checkbox from the form and append it to form data as an optional field.
                if (this.formRefs.isFree?.current?.checked) {
                    form_data.append('is_free', '1')
                }

                // Gets the source link from the form and append it to form data as an optional field.
                const linkValue = this.formRefs.link?.current?.value.trim()
                if (linkValue) {
                    form_data.append('link', linkValue)
                }

                // Gets the hashtag from the form and append it to form data as an optional field.
                const hashtagValue =
                    this.formRefs.hashtag?.current?.value.trim()
                if (hashtagValue) {
                    form_data.append('hashtag', hashtagValue)
                }

                // Gets the uploaded file from the form and append it to form data as an optional field.
                const topicUploadPhoto = this.formRefs.uploadPhoto?.current
                if (topicUploadPhoto.files.length) {
                    form_data.append('post_photo', topicUploadPhoto.files[0])
                }

                this.setState({ isFormUploading: true })

                const responseInsertTopic = await fetchWithErrorHandling(
                    API_DIRECTORY + '/insertTopic',
                    {
                        method: 'POST',
                        body: form_data,
                        credentials: 'include',
                    }
                )
                if (responseInsertTopic.status === 'success') {
                    this.redirectToTopic(responseInsertTopic.topicid)
                }
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseInsertTopic.status,
                    message: responseInsertTopic.message,
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

    handleCategoryChangeOrInvalid = (e) => {
        // Matches selected id with correspondant category from the list and finds event status.
        const selectedCategoryID = parseInt(e.target.value)
        const selectedCategory = [
            ...this.props.CategoryList.EventCategoryList,
            ...this.props.CategoryList.TopicCategoryList,
        ].find((category) => category.category_id === selectedCategoryID)

        this.handleInputChange(e, 'inputTopic', 'categoryID')
        updateState(this, 'inputTopic', {
            isEvent: selectedCategory?.isEvent ? true : false,
        })
    }
    handleCityChange = (e) => {
        const cityID = e.target.value
        updateState(this, 'inputTopic', { cityID })
        this.getVenues(cityID)
    }
    handleVenueChange = () => {
        const venueID = this.formRefs.venue?.current?.value.trim()
        updateState(this, 'inputTopic', { venueID })
    }
    handleStartDateChange = (date) => {
        updateState(this, 'inputTopic', { startDate: date, startTime: date })
    }
    handleStartTimeChange = (time) => {
        updateState(this, 'inputTopic', { startTime: time })
    }
    handleEndDateChange = (date) => {
        updateState(this, 'inputTopic', { endDate: date, endTime: date })
    }
    handleEndTimeChange = (time) => {
        updateState(this, 'inputTopic', { endTime: time })
    }
    handleLinkChange = () => {
        const link = this.formRefs.link?.current?.value.trim()
        updateState(this, 'inputTopic', { link })
    }
    handleHashtagChange = () => {
        const hashtag = this.formRefs.hashtag?.current?.value.trim()
        updateState(this, 'inputTopic', { hashtag })
    }

    // Render helper functions begin.
    renderSpinner = () => {
        const { isFormUploading } = this.state

        return isFormUploading ? (
            <div className="topicdraftform-spinner">
                <Spinner />
            </div>
        ) : null
    }

    renderRedirectedInfo = () => {
        const { isRedirected } = this.state.navigation

        return isRedirected ? (
            <div className="topicdraftform-redirectedinfo">
                Bu isimde etkinlik veya konu bulunumadı. Eklemek ister misin?
            </div>
        ) : null
    }

    renderCategory = () => {
        const { User, CategoryList } = this.props
        const isAdmin = checkUserAdminStatus(User)

        return (
            <div className="topicdraftform-category-wrapper">
                <select
                    name="category_id"
                    className="topicdraftform-category-dropdown"
                    ref={this.formRefs.category}
                    onChange={this.handleCategoryChangeOrInvalid}
                    onInvalid={this.handleCategoryChangeOrInvalid}
                    defaultValue=""
                    required
                >
                    <option value="" hidden>
                        Kategori seçin
                    </option>
                    {isAdmin && (
                        <>
                            <option value="" disabled>
                                -ETKİNLİKLER-
                            </option>
                            {CategoryList.EventCategoryList?.map(
                                (eventCategory) => (
                                    <option
                                        key={eventCategory.category_id}
                                        value={eventCategory.category_id}
                                    >
                                        {eventCategory.category_name}
                                    </option>
                                )
                            )}
                        </>
                    )}
                    <option value="" disabled>
                        -KONULAR-
                    </option>
                    {CategoryList.TopicCategoryList?.map((topicCategory) => (
                        <option
                            key={topicCategory.category_id}
                            value={topicCategory.category_id}
                        >
                            {topicCategory.category_name}
                        </option>
                    ))}
                </select>
                <div className="topicdraftform-category-icon-container">
                    <img
                        className="topicdraftform-category-icon"
                        src={iconCaretDown}
                        alt={iconCaretDown}
                    />
                </div>
            </div>
        )
    }

    renderCity = () => {
        const { isEvent } = this.state.inputTopic

        return isEvent ? (
            <div className="topicdraftform-city-wrapper">
                <select
                    name="city_id"
                    className="topicdraftform-city-dropdown"
                    ref={this.formRefs.city}
                    onChange={this.handleCityChange}
                    defaultValue=""
                >
                    <option value="" hidden>
                        Şehir seçin
                    </option>
                    <option value="82">Online</option>
                    <option value="34">İstanbul</option>
                    <option value="35">İzmir</option>
                    <option value="6">Ankara</option>
                </select>
                <div className="topicdraftform-city-icon-container">
                    <img
                        className="topicdraftform-city-icon"
                        src={iconCaretDown}
                        alt={iconCaretDown}
                    />
                </div>
            </div>
        ) : null
    }

    renderVenue = () => {
        const { inputTopic, VenueList } = this.state
        const { isEvent, cityID } = inputTopic

        return isEvent && isEvent !== '0' && cityID ? (
            <div className="topicdraftform-venue-wrapper">
                <select
                    name="venue_id"
                    className="topicdraftform-venue-dropdown"
                    ref={this.formRefs.venue}
                    onChange={this.handleVenueChange}
                    defaultValue=""
                >
                    <option value="" hidden>
                        (Opsiyonel) Mekan seçin
                    </option>
                    {VenueList !== null &&
                        VenueList.map((Venue) => {
                            return (
                                <option
                                    key={Venue.venue_id}
                                    value={Venue.venue_id}
                                >
                                    {Venue.venue_title}
                                </option>
                            )
                        })}
                </select>
                <div className="topicdraftform-venue-icon-container">
                    <img
                        className="topicdraftform-venue-icon"
                        src={iconCaretDown}
                        alt={iconCaretDown}
                    />
                </div>
            </div>
        ) : null
    }

    renderDates = () => {
        const { isEvent } = this.state.inputTopic

        // Hides keyboard on mobile.
        const DatepickerInput = forwardRef((props, ref) => (
            <input type="text" {...props} ref={ref} readOnly />
        ))

        return isEvent ? (
            <>
                <div className="topicdraftform-startdate-wrapper">
                    <div className="topicdraftform-startdate-datepicker">
                        <DatePicker
                            name="startDate"
                            className="topicdraftform-startdate-input"
                            ref={this.formRefs.startDate}
                            placeholderText="Başlangıç tarihi seçin."
                            popperClassName="topicdraftform-datepicker-popper"
                            selected={this.state.inputTopic.startDate}
                            clearButtonClassName="topicdraftform-startdate-close-icon"
                            dateFormat="d MMMM yyyy"
                            minDate={new Date()}
                            onChange={this.handleStartDateChange}
                            customInput={<DatepickerInput />}
                        />
                    </div>
                    <div className="topicdraftform-startdate-icon-container">
                        <img
                            className="topicdraftform-startdate-icon"
                            src={iconCalendarDays}
                            alt={iconCalendarDays}
                        />
                    </div>
                </div>
                <div className="topicdraftform-starttime-wrapper">
                    <div className="topicdraftform-starttime-datepicker">
                        <DatePicker
                            name="startTime"
                            className="topicdraftform-starttime-input"
                            ref={this.formRefs.startTime}
                            placeholderText="Başlangıç saati seçin."
                            selected={this.state.inputTopic.startTime}
                            showTimeSelect
                            dateFormat="HH:mm"
                            timeIntervals={30}
                            timeCaption="Saat"
                            minDate={this.state.inputTopic.startDate}
                            onChange={this.handleStartTimeChange}
                            customInput={<DatepickerInput />}
                        />
                    </div>
                    <div className="topicdraftform-starttime-icon-container">
                        <img
                            className="topicdraftform-starttime-icon"
                            src={iconClock}
                            alt={iconClock}
                        />
                    </div>
                </div>
                <div className="topicdraftform-enddate-wrapper">
                    <div className="topicdraftform-enddate-datepicker">
                        <DatePicker
                            name="endDate"
                            popperClassName="topicdraftform-datepicker-popper"
                            ref={this.formRefs.endDate}
                            placeholderText="(Opsiyonel) Bitiş tarihi seçin."
                            selected={this.state.inputTopic.endDate}
                            dateFormat="d MMMM yyyy"
                            minDate={this.state.inputTopic.startDate}
                            onChange={this.handleEndDateChange}
                            customInput={<DatepickerInput />}
                        />
                    </div>
                    <div className="topicdraftform-enddate-icon-container">
                        <img
                            className="topicdraftform-enddate-icon"
                            src={iconCalendarDays}
                            alt={iconCalendarDays}
                        />
                    </div>
                </div>
                <div className="topicdraftform-endtime-wrapper">
                    <div className="topicdraftform-endtime-datepicker">
                        <DatePicker
                            name="endTime"
                            ref={this.formRefs.endTime}
                            placeholderText="(Opsiyonel) Bitiş saati seçin."
                            selected={this.state.inputTopic.endTime}
                            showTimeSelect
                            dateFormat="HH:mm"
                            timeIntervals={30}
                            timeCaption="Saat"
                            minDate={this.state.inputTopic.endDate}
                            onChange={this.handleEndTimeChange}
                            customInput={<DatepickerInput />}
                        />
                    </div>
                    <div className="topicdraftform-endtime-icon-container">
                        <img
                            className="topicdraftform-endtime-icon"
                            src={iconClock}
                            alt={iconClock}
                        />
                    </div>
                </div>
            </>
        ) : null
    }

    renderFreeCheckbox = () => {
        const { isEvent } = this.state.inputTopic

        return isEvent && isEvent !== '0' ? (
            <div className="topicdraftform-free-wrapper">
                <input
                    name="is_free"
                    className="topicdraftform-free-icon"
                    type="checkbox"
                    ref={this.formRefs.isFree}
                />
                <span className="checkbox-label">Ücretsiz</span>
            </div>
        ) : null
    }

    renderTitle = () => {
        return (
            <div className="topicdraftform-title-wrapper">
                <textarea
                    name="title"
                    className="topicdraftform-title-textarea"
                    ref={this.formRefs.title}
                    value={this.state.inputTopic.inputTitle}
                    placeholder="Başlık girin."
                    rows="1"
                    onInvalid={(e) =>
                        this.handleInputChange(e, 'inputTopic', 'inputTitle')
                    }
                    onChange={(e) =>
                        this.handleInputChange(e, 'inputTopic', 'inputTitle')
                    }
                    tabIndex="1"
                    required
                />
            </div>
        )
    }

    renderText = () => {
        return (
            <div className="topicdraftform-post-textarea-wrapper">
                <textarea
                    name="post_text"
                    className="topicdraftform-post-textarea"
                    ref={this.formRefs.text}
                    value={this.state.inputTopic.inputText}
                    placeholder={
                        (this.state.inputTopic.inputTitle
                            ? this.state.inputTopic.inputTitle
                            : 'Bu konu') + ' hakkında yazın.'
                    }
                    rows="10"
                    onInvalid={(e) =>
                        this.handleInputChange(e, 'inputTopic', 'inputText')
                    }
                    onChange={(e) =>
                        this.handleInputChange(e, 'inputTopic', 'inputText')
                    }
                    tabIndex="2"
                    required
                />
            </div>
        )
    }

    renderLink = () => {
        const { isEvent } = this.state.inputTopic

        return isEvent && isEvent !== '0' ? (
            <div className="topicdraftform-link-wrapper">
                <textarea
                    name="link"
                    className="topicdraftform-link-textarea"
                    ref={this.formRefs.link}
                    onChange={this.handleLinkChange}
                    placeholder="Kaynak link ekleyin."
                    rows="1"
                    tabIndex="3"
                />
            </div>
        ) : null
    }

    renderHashtag = () => {
        const { isEvent } = this.state.inputTopic

        return isEvent && isEvent !== '0' ? (
            <div className="topicdraftform-hashtag-wrapper">
                <textarea
                    name="hashtag"
                    className="topicdraftform-hashtag-textarea"
                    ref={this.formRefs.hashtag}
                    onChange={this.handleHashtagChange}
                    placeholder="Etiket ekleyin. (Etiketler arasına virgül koyun.)"
                    rows="1"
                    tabIndex="4"
                />
            </div>
        ) : null
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
            <div className="topicdraftform-uploadphoto-container">
                <div className="topicdraftform-uploadphoto-info-wrapper">
                    <span>
                        {isPhotoSelected
                            ? 'Seçiminizi değiştirmek için ikona tekrar tıklayın.'
                            : 'Seçili fotoğraf yok'}
                    </span>
                </div>
                <div className="topicdraftform-uploadphoto-preview-container">
                    {isPhotoSelected && (
                        <div className="topicdraftform-uploadphoto-preview-wrapper">
                            <img
                                className="topicdraftform-uploadphoto-preview-image"
                                src={photoUrl}
                                alt="Preview"
                            />
                        </div>
                    )}
                    <span
                        className={`topicdraftform-uploadphoto-preview-info ${
                            isPhotoSelected
                                ? 'topicdraftform-uploadphoto-preview-success'
                                : 'topicdraftform-uploadphoto-preview-error'
                        }`}
                    >
                        {isPhotoSelected ? `${photoName}, ${photoSize}.` : ''}
                    </span>
                </div>
            </div>
        )
    }

    renderButtons = () => (
        <div className="topicdraftform-buttons-container">
            <div className="topicdraftform-buttons-wrapper topicdraftform-buttons-wrapper-left">
                <div
                    className="topicdraftform-button-uploadphoto-container"
                    onClick={this.handleOpenPhotoList}
                >
                    <div
                        className="topicdraftform-button-uploadphoto-wrapper"
                        onClick={this.handleOpenPhotoList}
                    >
                        <img
                            className="topicdraftform-button-uploadphoto-icon"
                            src={iconCamera}
                            alt={iconCamera}
                        />
                    </div>
                    <div className="topicdraftform-button-uploadphoto-text">
                        Fotoğraf Ekle
                    </div>
                    <input
                        type="file"
                        className="topicdraftform-button-uploadphoto-invisible"
                        name="post_photo"
                        ref={this.formRefs.uploadPhoto}
                        onChange={this.handleSelectPhoto}
                        accept="image/*"
                    />
                </div>
                <div className="topicdraftform-button-wrapper">
                    <input
                        className="topicdraftform-button-addspoiler"
                        type="button"
                        value="Spoiler Ekle"
                        onClick={this.handleAddSpoiler}
                    />
                </div>
            </div>
            <div className="topicdraftform-buttons-wrapper topicdraftform-buttons-wrapper-right">
                <div className="topicdraftform-button-wrapper">
                    <input
                        className="topicdraftform-button-send"
                        type="submit"
                        value="Gönder"
                    />
                </div>
            </div>
        </div>
    )
    // Render helper functions end.

    render() {
        const { isEvent } = this.state.inputTopic

        return (
            <>
                <Helmet>
                    <title>
                        {isEvent ? 'Etkinlik' : 'Konu'} Ekle | Şallı Turna
                    </title>
                </Helmet>
                {this.renderRedirectedInfo()}
                <form
                    className="topicdraftform-form"
                    encType="multipart/form-data"
                    onSubmit={this.insertTopic}
                    autoComplete="off"
                >
                    {this.renderSpinner()}
                    <div className="topicdraftform-container">
                        {this.renderCategory()}
                        {this.renderCity()}
                        {this.renderVenue()}
                        {this.renderDates()}
                        {this.renderFreeCheckbox()}
                        {this.renderTitle()}
                        {this.renderText()}
                        {this.renderLink()}
                        {this.renderHashtag()}
                        {this.renderPhotoPreview()}
                        {this.renderButtons()}
                    </div>
                </form>
            </>
        )
    }
}

class TopicDraft extends Component {
    constructor(props) {
        super(props)
        this.state = {
            CategoryList: {},
        }
    }

    componentDidMount() {
        if (this.props.User.id !== null) {
            this.getCategories()
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.getCategories()
        }
    }

    getCategories = async () => {
        const { setDialog } = this.props

        try {
            // Gets both event and topic categories from db.
            const url = `${API_DIRECTORY}/getCategories`
            const responseCategories = await fetchWithErrorHandling(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            const { status, message, CategoryList } = responseCategories
            if (status === 'success') {
                this.setState({
                    CategoryList,
                })
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
        }
    }

    render() {
        const { CategoryList } = this.state
        if (!Object.keys(CategoryList).length) {
            return null
        }

        return (
            <div className="topicdraft-container">
                <TopicForm {...this.props} CategoryList={CategoryList} />
            </div>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(TopicDraft)
