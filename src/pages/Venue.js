import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { API_DIRECTORY } from '../utils/constants.js';
import '../styles/App.scss';
import '../styles/Venue.scss';

import GoogleMapReact from 'google-map-react';

const mapStateToProps = (state) => {
	return {
		User: state.user,
	};
};

const VenueMap = ({ text }) => (
	<div className='venue-map-icon'>
		<span className='venue-map-text'>{text}</span>
	</div>
);

class Venue extends Component {
	constructor(props) {
		super(props);
		this.state = {
			Venue: null,
			venuedownloading: true,
		};
	}

	componentDidMount() {
		this.getVenue();
		window.scrollTo(0, 0);
	}

	getVenue = () => {
		this.setState({ venuedownloading: true });
		const venueId = this.props.venueid
			? this.props.venueid
			: this.props.match.params.venueid;
		fetch(API_DIRECTORY + '/getVenue/' + venueId, {
			method: 'get',
			headers: {
				'content-type': 'application/json; charset=UTF-8',
			},
			credentials: 'include',
		})
			.then((res) => {
				if (res.status === 200) return res.json();
				else return { error: 'there was an error with response' };
			})
			.then((responseVenue) => {
				if (responseVenue.status === 'success') {
					this.setState({ Venue: responseVenue.Venue });
				} else {
					this.props.openDialog(responseVenue.status, responseVenue.message);
				}
				this.setState({ venuedownloading: false });
			})
			.catch((err) => {
				this.props.openDialog('error', 'Bilinmeyen bir hatayla karşılaşıldı.');
				throw new Error(err);
			});
	};

	render() {
		const venueId = this.props.venueid
			? this.props.venueid
			: this.props.match.params.venueid;
		const Venue = this.state.Venue;
		if (Venue == null || venueId == null) {
			return null;
		}
		const titleArea = this.state.venuedownloading ? (
			<div className='venue-title-container'>
				<div className='venue-title-wrapper'>
					<h1 className='venue-title-skeleton'></h1>
				</div>
			</div>
		) : (
			<div className='venue-title-container'>
				<div className='venue-title-wrapper'>
					<h1 key={venueId} className='venue-title'>
						{Venue.venue_title}
					</h1>
				</div>
			</div>
		);

		const locationArea = this.state.venuedownloading ? (
			<div className='venue-location-container'>
				<div className='venue-location-wrapper'>
					<span className='venue-location-skeleton'></span>
				</div>
			</div>
		) : (
			Venue.venue_location && (
				<div className='venue-location-container'>
					<div className='venue-location'>
						<div style={{ height: '15rem', width: '100%' }}>
							<GoogleMapReact
								bootstrapURLKeys={{
									key: process.env.GOOGLEMAPS_API,
								}}
								defaultCenter={{
									lat: Number(Venue.venue_location.split(',')[0]),
									lng: Number(Venue.venue_location.split(',')[1]),
								}}
								defaultZoom={15}
							>
								<VenueMap
									lat={Number(Venue.venue_location.split(',')[0])}
									lng={Number(Venue.venue_location.split(',')[1])}
									text={Venue.venue_title}
								/>
							</GoogleMapReact>
						</div>
					</div>
				</div>
			)
		);

		const textArea = this.state.venuedownloading ? (
			<div className='venue-text-container'>
				<div className='venue-text-wrapper'>
					<span className='venue-text-skeleton'></span>
				</div>
			</div>
		) : (
			Venue.venue_text && (
				<div className='venue-text-container'>
					<div className='venue-text-wrapper'>
						<span className='venue-text'>{Venue.venue_text}</span>
					</div>
				</div>
			)
		);

		return (
			<>
				<Helmet>
					<title>{Venue.venue_title} | Şallı Turna</title>
				</Helmet>
				<div className='venue-container'>
					{titleArea}
					{locationArea}
					{textArea}
				</div>
			</>
		);
	}
}

export default connect(mapStateToProps)(Venue);
