import React, { Component } from 'react'

/* External Libraries */
import { connect } from 'react-redux'

/* Internal Components */
import { TitleHelmet, HELMET_PRIORITY } from '../components/Helmet'

/* Constants and Helpers */
import { API_DIRECTORY, GOOGLEMAPS_API } from '../utils/constants.js'
import { fetchWithErrorHandling } from '../utils/commons'
import { setDialog } from '../actions/dialogActions'

/* Styling */
import '../styles/Venue.scss'

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

class Venue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            Venue: null,
            isVenueDownloading: false,
        }
    }

    componentDidMount() {
        this.getVenue()
    }

    getVenue = async () => {
        const { setDialog, venueid, match } = this.props

        try {
            // Shows user a loading animation.
            this.setState({ isVenueDownloading: true })

            const venueID = venueid || match.params.venueid

            const url = `${API_DIRECTORY}/getVenue/${venueID}`
            const responseVenue = await fetchWithErrorHandling(url, {
                method: 'GET',
                headers: {
                    'content-type': 'application/json; charset=UTF-8',
                },
                credentials: 'include',
            })
            const { status, message, Venue } = responseVenue
            if (status === 'success') {
                this.setState({ Venue })
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
            this.setState({ isVenueDownloading: false })
        }
    }

    // Render helper functions begin.
    renderSkeleton = () => {
        return (
            <>
                <div className="venue-title-container">
                    <div className="venue-title-wrapper">
                        <h1 className="venue-title-skeleton"></h1>
                    </div>
                </div>
                <div className="venue-location-container">
                    <div className="venue-location-wrapper">
                        <span className="venue-location-skeleton"></span>
                    </div>
                </div>
                <div className="venue-text-container">
                    <div className="venue-text-wrapper">
                        <span className="venue-text-skeleton"></span>
                    </div>
                </div>
            </>
        )
    }

    renderVenue = () => {
        const { venueid, match } = this.props
        const Venue = this.state.Venue

        const venueID = venueid || match.params.venueid
        const venueLatitude = Number(Venue.venue_location.split(',')[0])
        const venueLongitude = Number(Venue.venue_location.split(',')[1])
        const src = `https://www.google.com/maps/embed/v1/place?key=${GOOGLEMAPS_API}&q=${venueLatitude},${venueLongitude}&language=tr`

        return (
            <>
                <div className="venue-title-container">
                    <div className="venue-title-wrapper">
                        <h1 key={venueID} className="venue-title">
                            {Venue.venue_title}
                        </h1>
                    </div>
                </div>
                {Venue.venue_location ? (
                    <div className="venue-location-container">
                        <div className="venue-location">
                            <iframe
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={src}
                            />
                        </div>
                    </div>
                ) : null}
                {Venue.venue_text ? (
                    <div className="venue-text-container">
                        <div className="venue-text-wrapper">
                            <span className="venue-text">
                                {Venue.venue_text}
                            </span>
                        </div>
                    </div>
                ) : null}
            </>
        )
    }
    // Render helper functions end.

    render() {
        const { venueid, match } = this.props
        const { isVenueDownloading, Venue } = this.state

        const venueID = venueid || match.params.venueid

        if (Venue == null || venueID == null) {
            return null
        }

        return (
            <>
                <TitleHelmet
                    title={`${Venue.venue_title} | Şallı Turna`}
                    priority={HELMET_PRIORITY.LOW}
                />
                <div className="venue-container">
                    {isVenueDownloading
                        ? this.renderSkeleton()
                        : this.renderVenue()}
                </div>
            </>
        )
    }
}

// Connects component to Redux and exports it.
export default connect(mapStateToProps, mapDispatchToProps)(Venue)
