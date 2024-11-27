import React, { Component, createRef } from 'react'

/* External Libraries */
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})

/* Constants and Helpers */
import { CLOUDINARY_NAME } from '../utils/constants.js'
import { bindDocumentEvents, unbindDocumentEvents } from '../utils/commons'
import { setModal } from '../actions/modalActions'

/* Styling */
import '../styles/PhotoModal.scss'

// Redux functions to connect Redux store begin.
const mapStateToProps = (state) => {
    return {
        modal: state.modal,
    }
}
const mapDispatchToProps = {
    setModal,
}
// Redux functions to connect Redux store end.

class PhotoModal extends Component {
    constructor(props) {
        super(props)

        this.state = {
            lastEventTime: 0,
        }

        this.modalPhotoRef = createRef()
    }

    componentDidMount() {
        // Binds click events to the document. Optimized for mobile devices.
        // Prevents trigger first time clicks via capture option.
        bindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideModal,
            { capture: true }
        )
    }

    componentWillUnmount() {
        // Unbinds click events from the document. Optimized for mobile devices.
        unbindDocumentEvents(
            ['touchstart', 'mousedown', 'click'],
            this.handleClickOutsideModal,
            { capture: true }
        )
    }

    handleClickOutsideModal = (e) => {
        // Prevents the same action from firing multiple times by using last event time to debounce.
        // 300ms is a standard threshold for older devices or legacy browsers.
        const currentTime = new Date().getTime()
        const { lastEventTime } = this.state
        if (currentTime - lastEventTime < 300) return

        // Hides modal from the view according to click area.
        const modalPhoto = this.modalPhotoRef.current
        if (modalPhoto && !modalPhoto.contains(e.target)) {
            this.closeModal()
            this.setState({ lastEventTime: currentTime })
        }
    }

    closeModal = () => {
        const { setModal } = this.props
        if (typeof setModal === 'function') {
            setModal({ isModalActive: false, photoLink: '' })
        } else {
            console.error('setModal fonksiyonu geçersiz veya tanımlanmamış.')
        }
    }

    render() {
        const { modal } = this.props
        // Ensures modal and its properties are properly defined.
        const isModalActive = modal?.isModalActive ?? false
        const photoLink = modal?.photoLink ?? ''

        const myImage = myCloudinary.image(photoLink)

        return (
            <div
                className="modalphoto-container"
                style={{
                    display: isModalActive ? 'block' : 'none',
                }}
            >
                <div
                    className="modalphoto-photo-container"
                    ref={this.modalPhotoRef}
                >
                    <span
                        className="modalphoto-close"
                        onClick={this.closeModal}
                    ></span>
                    <div className="modalphoto-photo">
                        <AdvancedImage
                            width="100%"
                            height="auto"
                            cldImg={myImage}
                            alt="Modal Foto"
                        />
                    </div>
                </div>
            </div>
        )
    }
}
PhotoModal.propTypes = {
    modal: PropTypes.shape({
        isModalActive: PropTypes.bool.isRequired,
        photoLink: PropTypes.string.isRequired,
    }).isRequired,
    setModal: PropTypes.func.isRequired,
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(PhotoModal)
