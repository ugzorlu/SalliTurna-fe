import React, { Component, createRef } from 'react'

/* External Libraries */
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Cloudinary } from '@cloudinary/url-gen'
import { AdvancedImage } from '@cloudinary/react'
const myCloudinary = new Cloudinary({
    cloud: {
        cloudName: CLOUDINARY_NAME,
    },
})

/* Internal Components */
import Spinner from '../components/Spinner'
import SinglePost from '../components/SinglePost'

/* Constants and Helpers */
import { API_DIRECTORY, CLOUDINARY_NAME } from '../utils/constants'
import {
    validFileType,
    getReadableFileSize,
    updateState,
    fetchWithErrorHandling,
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
import iconAngleUp from '../assets/fontawesome/angle-up-solid.svg'
import iconAngleDown from '../assets/fontawesome/angle-down-solid.svg'
import iconShareNodes from '../assets/fontawesome/share-nodes-solid.svg'
import iconCamera from '../assets/fontawesome/camera-solid.svg'
import '../styles/Post.scss'
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
            inputText: props.Post.post_text,
            inputPhoto: {
                isPhotoIconClicked: false,
                isPhotoSelected: false,
                isPhotoTypeValid: false,
                photoName: '',
                photoSize: 0,
                photoUrl: '',
            },
            isPostFormUploading: false,
        }
        this.validators = PostFormValidators
        resetValidators(this.validators)

        this.validators = updateValidators(
            this.validators,
            'inputText',
            props.Post.post_text
        )

        this.uploadPhotoRef = createRef()
        this.postTextareaRef = createRef()
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

    handleOpenPhotoList = () => {
        // Mimicks a click to an invisible upload photo button.
        this.uploadPhotoRef?.current.click()

        // Makes upload photo preview area visible.
        updateState(this, 'inputPhoto', { isPhotoIconClicked: true })
    }

    handleSelectPhoto = () => {
        const { setDialog } = this.props

        const input = this.uploadPhotoRef?.current // Gets selected photo and assigns to a variable.
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

    updatePost = async (e) => {
        e.preventDefault()
        const { setDialog, Post } = this.props

        if (isFormValid(this.validators)) {
            // Uses FormData with default constructor to ensure the order of the fields and files.
            // Formidable expects text fields to appear before the file field.
            let form_data = new FormData()

            // Appends Post ID related to the post.
            form_data.append('post_id', Post.post_id)

            // Gets the posted text from the form and append it to form data as a required field.
            const postTextarea = this.postTextareaRef?.current
            if (postTextarea && postTextarea.value.trim() !== '') {
                form_data.append('post_text', postTextarea.value.trim())
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
            const uploadPhoto = this.uploadPhotoRef?.current
            if (uploadPhoto.files.length) {
                form_data.append('post_photo', uploadPhoto.files[0])
            }

            try {
                // Shows user a loading animation.
                this.setState({ isPostFormUploading: true })

                // Updates post in the db.
                const url = `${API_DIRECTORY}/updatePost`
                const responseUpdatePost = await fetchWithErrorHandling(url, {
                    method: 'POST',
                    body: form_data,
                    credentials: 'include',
                })
                const { status, message } = responseUpdatePost
                if (status === 'success') {
                    this.props.history.push('/topic/' + Post.Topic.topic_id)
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
                this.setState({ isPostFormUploading: false })
            }
        }
    }

    // Render helper functions begin.
    renderSpinner = () => {
        const { isPostFormUploading } = this.state

        return isPostFormUploading ? (
            <div className="post-spinner">
                <Spinner />
            </div>
        ) : null
    }

    renderPhotoPreview = () => {
        const { post_photo } = this.props.Post
        const { inputPhoto } = this.state
        const {
            isPhotoIconClicked,
            isPhotoSelected,
            photoName,
            photoSize,
            photoUrl,
        } = inputPhoto

        // Renders the posted photo if any is present and if new photo is not selected.
        const myImage = myCloudinary.image(post_photo)
        const postPhotoArea =
            post_photo && !isPhotoSelected ? (
                <div className="post-photo-wrapper">
                    <AdvancedImage
                        width="50%"
                        height="auto"
                        cldImg={myImage}
                        alt="Post Foto"
                    />
                </div>
            ) : null

        if (!isPhotoIconClicked) return null
        return (
            <div className="post-form-uploadphoto-container">
                {postPhotoArea}
                <div className="post-form-uploadphoto-info-wrapper">
                    <span>
                        {isPhotoSelected
                            ? 'Seçiminizi değiştirmek için ikona tekrar tıklayın.'
                            : 'Seçili fotoğraf yok'}
                    </span>
                </div>
                <div className="post-form-uploadphoto-preview-container">
                    {isPhotoSelected && (
                        <div className="post-form-uploadphoto-preview-wrapper">
                            <img
                                className="post-form-uploadphoto-preview-image"
                                src={photoUrl}
                                alt="Preview"
                            />
                        </div>
                    )}
                    <span
                        className={`post-form-uploadphoto-preview-info ${
                            isPhotoSelected
                                ? 'post-form-uploadphoto-preview-success'
                                : 'post-form-uploadphoto-preview-error'
                        }`}
                    >
                        {isPhotoSelected ? `${photoName}, ${photoSize}.` : ''}
                    </span>
                </div>
            </div>
        )
    }

    renderButtons = () => (
        <div className="post-form-buttons-container">
            <div className="post-form-buttons-wrapper post-form-buttons-wrapper-left">
                <div className="post-button-wrapper">
                    <input
                        className="post-button-cancel"
                        onClick={this.props.hidePostForm}
                        type="button"
                        value="Vazgeç"
                    />
                </div>
                <div
                    className="post-form-button-uploadphoto-container"
                    onClick={this.handleOpenPhotoList}
                >
                    <div
                        className="post-form-button-uploadphoto-wrapper"
                        onClick={this.handleOpenPhotoList}
                    >
                        <img
                            className="post-form-button-uploadphoto-icon"
                            src={iconCamera}
                            alt={iconCamera}
                        />
                    </div>
                    <div className="post-form-button-uploadphoto-text">
                        Fotoğraf Ekle
                    </div>
                    <input
                        type="file"
                        className="post-form-button-uploadphoto-invisible"
                        name="post_photo"
                        ref={this.uploadPhotoRef}
                        onChange={this.handleSelectPhoto}
                        accept="image/*"
                    />
                </div>
            </div>
            <div className="post-form-buttons-wrapper post-form-buttons-wrapper-right">
                <div className="post-button-wrapper">
                    <input
                        className="post-button-send"
                        onClick={this.updatePost}
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
            <form className="post-form">
                {this.renderSpinner()}
                <div className="post-form-textarea-container">
                    <textarea
                        name="post_text"
                        className="post-form-textarea"
                        ref={this.postTextareaRef}
                        value={this.state.inputText}
                        placeholder="Siz de bu konu hakkında bilgi verin."
                        rows="10"
                        onInvalid={(e) =>
                            this.handleInputChange(e, 'inputText')
                        }
                        onChange={(e) => this.handleInputChange(e, 'inputText')}
                        required
                    >
                        {this.state.inputText}
                    </textarea>
                </div>
                <div className="post-form-bottom-container">
                    {this.renderPhotoPreview()}
                    {this.renderButtons()}
                </div>
            </form>
        )
    }
}
// Connects component to Redux and exports with React Router.
const ConnectedPostForm = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(PostForm)
)

class Post extends Component {
    constructor(props) {
        super(props)

        const isEdit = this.props.location.hash === '#edit'

        this.state = {
            isSinglePostActive: !isEdit,
            isPostFormActive: isEdit,
            isPostDownloading: true,
            Post: null,
        }
    }

    componentDidMount() {
        const { postid } = this.props.match.params
        this.getPost(postid)
    }

    getPost = async (postID) => {
        const { setDialog } = this.props

        try {
            // Shows user a loading animation.
            this.setState({ isPostDownloading: true })

            // Gets post from the db.
            const url = `${API_DIRECTORY}/getPost/${postID}`
            const responsePost = await fetchWithErrorHandling(url, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            const { status, message } = responsePost
            if (status === 'success') {
                this.setState({ Post: responsePost.Post })
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
            this.setState({ isPostDownloading: false })
        }
    }

    togglePostForm = (isFormActive) => {
        this.setState({
            isPostFormActive: isFormActive,
            isSinglePostActive: !isFormActive,
        })
    }

    // Render helper functions begin.
    renderSkeleton = () => (
        <div className="profile-posts-skeleton-container">
            <div className="topic-title-container">
                <div className="topic-title-wrapper">
                    <h1 className="topic-title-skeleton"></h1>
                </div>
            </div>
            <div className="singlepost-container">
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
    )

    renderPostContent = () => {
        const { Post, isSinglePostActive, isPostDownloading } = this.state

        if (isPostDownloading) {
            return this.renderSkeleton()
        }
        if (Post === null) return null

        return (
            <>
                <div className="topic-title-container">
                    <div className="topic-title-wrapper">
                        <Link to={`/topic/${Post.Topic.topic_id}`}>
                            <h1 className="topic-title">
                                {Post.Topic.topic_title}
                                {Post.Topic.Category.isEvent === 0 &&
                                    ` (${Post.Topic.Category.category_name})`}
                            </h1>
                        </Link>
                    </div>
                </div>
                {isSinglePostActive && (
                    <div className="postlist-container">
                        <SinglePost
                            key={Post.post_id}
                            Post={Post}
                            showPostForm={(e) => this.togglePostForm(true)}
                            getPost={this.getPost}
                        />
                    </div>
                )}
            </>
        )
    }

    renderPostForm = () => {
        const { User } = this.props
        const { isPostFormActive, Post } = this.state

        if (Post === null) return null

        const isUserThePostOwner = User?.id === Post.User.user_id

        if (!isUserThePostOwner || !isPostFormActive) {
            return null
        }

        return (
            <div className="post-form-container">
                <ConnectedPostForm
                    Post={Post}
                    inputText={Post.post_text}
                    hidePostForm={(e) => this.togglePostForm(false)}
                />
            </div>
        )
    }
    // Render helper functions end.

    render() {
        return (
            <div className="post-container">
                {this.renderPostContent()}
                {this.renderPostForm()}
            </div>
        )
    }
}

// Connects component to Redux.
const ConnectedPost = connect(mapStateToProps, mapDispatchToProps)(Post)

// Exports component with React Router.
export default withRouter(ConnectedPost)
