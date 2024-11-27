import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
import { fill } from '@cloudinary/url-gen/actions/resize'
import { byRadius, max } from '@cloudinary/url-gen/actions/roundCorners'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})
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
import { API_DIRECTORY, CLOUDINARY_NAME } from '../utils/constants.js'
import { calendarStrings } from '../utils/constants.js'
import { updateState, fetchWithErrorHandling } from '../utils/commons'
import {
    InboxValidators,
    resetValidators,
    updateValidators,
    updateStateAndValidate,
    isFormValid,
} from '../utils/validators'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import iconReply from '../assets/fontawesome/reply-solid.svg'
import '../styles/Inbox.scss'

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

class Inbox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            LatestMessages: null,
            Messages: null,
            inputMessage: {
                selectedCorrespender: null,
                messageText: '',
            },
        }

        const selectedCorrespenderID =
            props.location.search?.replace('?corresponderid=', '') || null
        if (selectedCorrespenderID) {
            this.getProfile(selectedCorrespenderID)
        }

        this.validators = InboxValidators
        resetValidators(this.validators)
    }

    componentDidMount() {
        const { search } = this.props.location
        const { selectedCorrespender } = this.state.inputMessage

        if (!search) {
            this.getLatestMessages()
            if (selectedCorrespender) {
                this.getMessages(selectedCorrespender.user_id)
            }
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

    changeCorresponder = (e) => {
        const corresponderId = e.currentTarget.dataset.corresponderid
        const corresponderName = e.currentTarget.dataset.correspondername

        updateState(this, 'inputMessage', {
            selectedCorrespender: {
                user_id: corresponderId,
                user_name: corresponderName,
            },
        })
        this.getMessages(corresponderId)
    }

    getProfile = async (userid) => {
        const { setDialog } = this.props

        try {
            const url = `${API_DIRECTORY}/getProfile/${userid}`
            const body = JSON.stringify({
                targetpagenumber: 1,
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
                updateState(this, 'inputMessage', {
                    selectedCorrespender: Profile.User,
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

    getLatestMessages = async () => {
        const { setDialog } = this.props

        try {
            const url = `${API_DIRECTORY}/getLatestMessages`
            const responseLatestMessages = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            if (responseLatestMessages.status === 'success') {
                this.setState({
                    LatestMessages: responseLatestMessages.LatestMessages,
                })
                if (responseLatestMessages.LatestMessages.length) {
                    if (
                        responseLatestMessages.LatestMessages[0].receiver
                            .user_id == this.props.User.id
                    ) {
                        updateState(this, 'inputMessage', {
                            selectedCorrespender:
                                responseLatestMessages.LatestMessages[0].sender,
                        })
                        this.getMessages(
                            responseLatestMessages.LatestMessages[0].sender
                                .user_id
                        )
                    } else {
                        updateState(this, 'inputMessage', {
                            selectedCorrespender:
                                responseLatestMessages.LatestMessages[0]
                                    .receiver,
                        })
                        this.getMessages(
                            responseLatestMessages.LatestMessages[0].receiver
                                .user_id
                        )
                    }
                }
            } else {
                // Displays custom error/warning message from server response.
                setDialog({
                    isDialogActive: true,
                    status: responseLatestMessages.status,
                    message: responseLatestMessages.message,
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

    getMessages = async (corresponderid) => {
        const { setDialog } = this.props

        try {
            const url = `${API_DIRECTORY}/getMessages/${corresponderid}`
            const responseMessages = await fetchWithErrorHandling(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            const { status, message, Messages } = responseMessages
            if (status === 'success') {
                this.setState({ Messages })
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

    sendMessage = async (e) => {
        e.preventDefault()
        const { setDialog } = this.props

        if (isFormValid(this.validators)) {
            try {
                const url = `${API_DIRECTORY}/sendMessage`
                const body = JSON.stringify({
                    corresponder_id:
                        this.state.inputMessage.selectedCorrespender.user_id,
                    message_text: this.state.inputMessage.messageText,
                })
                const responseSendMessage = await fetchWithErrorHandling(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                    body,
                    credentials: 'include',
                })
                const { status, message } = responseSendMessage
                if (status === 'success') {
                    this.props.history.push('/inbox')
                    updateState(this, 'inputMessage', { messageText: '' })
                    this.getLatestMessages()
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
    }

    // Render helper functions begin.
    renderLatestMessages = () => {
        const { LatestMessages } = this.state
        const currentUser = this.props.User.id

        return (
            <div className="inbox-users-container">
                <div className="inbox-users-title">
                    {LatestMessages && LatestMessages.length
                        ? 'Kişiler'
                        : 'Henüz mesajınız yok.'}
                </div>
                <div className="inbox-latestmessages-wrapper">
                    {LatestMessages &&
                        LatestMessages.map((Message) => {
                            const isSender =
                                Message.sender.user_id === currentUser
                            const corresponder = isSender
                                ? Message.receiver
                                : Message.sender
                            const isUnread = !isSender && Message.isUnread === 1

                            const myImage = myCloudinary.image(
                                corresponder.user_photo
                            )
                            myImage
                                .resize(fill().width(40).height(40))
                                .roundCorners(byRadius(max))
                                .backgroundColor('#FFF')
                            const publicPhoto = corresponder.user_photo ? (
                                <AdvancedImage
                                    alt="Profil Foto"
                                    width="100%"
                                    height="auto"
                                    cldImg={myImage}
                                />
                            ) : null

                            const messagePreviewClass = `inbox-latestmessages-messagepreview-wrapper ${
                                isUnread
                                    ? 'inbox-latestmessages-messagepreview-wrapper-unread'
                                    : ''
                            }`

                            return (
                                <div
                                    key={`message-${Message.message_id}`}
                                    className={messagePreviewClass}
                                    data-corresponderid={corresponder.user_id}
                                    data-correspondername={
                                        corresponder.user_name
                                    }
                                    onClick={this.changeCorresponder}
                                >
                                    {!isSender && (
                                        <img
                                            className="inbox-latestmessages-messagepreview-replyimage"
                                            src={iconReply}
                                            alt={iconReply}
                                        />
                                    )}
                                    <div className="inbox-latestmessages-messagepreview-userphoto">
                                        {publicPhoto}
                                    </div>
                                    <span className="inbox-latestmessages-messagepreview-username">
                                        {corresponder.user_name}
                                    </span>
                                    <span className="inbox-latestmessages-messagepreview-messagedate">
                                        {dayjs(Message.message_date).calendar(
                                            null,
                                            calendarStrings
                                        )}
                                    </span>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }

    renderSelectedMessages = () => {
        const { Messages } = this.state
        const current_user = this.props.User.id

        if (!Messages || !Messages.length) return null

        const corresponder =
            Messages[0].sender.user_id === current_user
                ? Messages[0].receiver
                : Messages[0].sender

        const myImage = myCloudinary.image(corresponder.user_photo)
        myImage
            .resize(fill().width(40).height(40))
            .roundCorners(byRadius(max))
            .backgroundColor('#FFF')
        const publicPhoto = corresponder.user_photo ? (
            <AdvancedImage
                alt="Profil Foto"
                width="100%"
                height="auto"
                cldImg={myImage}
            />
        ) : null

        return (
            <div className="inbox-messages-container">
                <Link to={`/profile/${corresponder.user_id}`}>
                    <div className="inbox-messages-userarea">
                        <span className="inbox-messages-userphoto">
                            {publicPhoto}
                        </span>
                        <span className="inbox-messages-username">
                            {corresponder.user_name}
                        </span>
                    </div>
                </Link>
                <div className="inbox-messages-wrapper">
                    {Messages.map((Message) => {
                        const isSender = Message.sender.user_id === current_user
                        const messageClass = isSender
                            ? 'inbox-messages-message-right'
                            : 'inbox-messages-message-left'
                        const timeClass = isSender
                            ? 'inbox-messages-messagetime-right'
                            : 'inbox-messages-messagetime-left'

                        return (
                            <div
                                className={`${messageClass}-container`}
                                key={`message-${Message.message_id}`}
                            >
                                <div className={`${messageClass}-wrapper`}>
                                    <div className={messageClass}>
                                        {Message.message_text}
                                    </div>
                                    <div className={timeClass}>
                                        {dayjs(Message.message_date).calendar(
                                            null,
                                            calendarStrings
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    renderSendMessage = () => {
        const { selectedCorrespender } = this.state.inputMessage
        const { LatestMessages, Messages } = this.state
        const hasMessages =
            (LatestMessages && LatestMessages.length) ||
            Messages ||
            selectedCorrespender

        if (!hasMessages) return null

        return (
            <form
                className="inbox-sendmessage-form"
                onSubmit={this.sendMessage}
            >
                {selectedCorrespender && (
                    <span className="inbox-sendmessage-corresponder">
                        Kime: {selectedCorrespender.user_name}
                    </span>
                )}
                <div className="inbox-sendmessage-textarea-container">
                    <textarea
                        className="inbox-sendmessage-textarea"
                        name="message_text"
                        value={this.state.inputMessage.messageText}
                        placeholder="Mesajınızı yazın."
                        rows="6"
                        onChange={(e) =>
                            this.handleInputChange(
                                e,
                                'inputMessage',
                                'messageText'
                            )
                        }
                        required
                    />
                </div>
                <div className="inbox-sendmessage-bottom-container">
                    <div className="inbox-sendmessage-buttons-wrapper inbox-sendmessage-buttons-wrapper-right">
                        <div className="inbox-sendmessage-button-wrapper">
                            <input
                                className="inbox-sendmessage-button-send"
                                type="submit"
                                value="Gönder"
                            />
                        </div>
                    </div>
                </div>
            </form>
        )
    }
    // Render helper functions end.

    render() {
        return (
            <div className="inbox-container">
                {this.renderLatestMessages()}
                {this.renderSelectedMessages()}
                {this.renderSendMessage()}
            </div>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(Inbox)
