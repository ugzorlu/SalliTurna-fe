import { connect } from 'react-redux';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Div100vh from 'react-div-100vh';

import TopBar from './components/TopBar';
import LeftFrame from './components/LeftFrame';
import Main from './components/Main';
import Footer from './components/Footer';
import Dialog from './components/Dialog';
import Cookie from './components/Cookie';
import PhotoModal from './components/PhotoModal';

import './styles/App.scss';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			leftframe: {
				search: {
					isSearchActive: false,
					keyword: '',
				},
				isMobileLeftFrameHidden: true,
				category: {
					isEventSelected: true,
					isTopicSelected: false,
				},
				// TODO use a better state
				rand: Math.random(),
			},
			dialog: {
				isDialogHidden: true,
				status: null,
				message: null,
			},
			modal: {
				isModalHidden: true,
				photoLink: null,
			},
		};
	}

	openDialog = (dialogStatus, dialogMessage, progressAction) => {
		this.setState({
			dialog: {
				isDialogHidden: false,
				status: dialogStatus,
				message: dialogMessage,
				action: progressAction,
			},
		});
	};

	closeDialog = () => {
		this.setState({
			dialog: {
				isDialogHidden: true,
				status: null,
				message: null,
			},
		});
	};

	updateLeftFrame = (isMobileLeftFrameHidden, isEventSelected) => {
		this.setState({
			leftframe: {
				isMobileLeftFrameHidden:
					isMobileLeftFrameHidden != null ? isMobileLeftFrameHidden : true,
				search: {
					isSearchActive: false,
					keyword: '',
				},
				category: {
					isEventSelected: isEventSelected != null ? isEventSelected : true,
					isTopicSelected: isEventSelected != null ? !isEventSelected : false,
				},
				rand: Math.random(),
			},
		});
	};

	searchTopics = (keyword) => {
		this.setState({
			leftframe: {
				search: {
					isSearchActive: true,
					keyword,
				},
			},
		});
	};

	//Redirect page with found topic or proposed new topic addition
	//TODO: Cannot redirect in the proposed new topic addition with a new proposed new topic
	updateTopic = (keyword, topic) => {
		if (topic) {
			this.props.history.push(`/topic/${topic.topic_id}`);
		} else {
			this.props.history.push(`/topic/draft?title=${keyword}&redirected=true`);
		}
	};

	updateModal = (isModalHidden, photoLink) => {
		this.setState({
			modal: {
				isModalHidden,
				photoLink,
			},
		});
	};

	render() {
		const { leftframe, dialog, modal } = this.state;
		const renderDialog = modal.isDialogHidden ? null : (
			<Dialog dialog={dialog} closeDialog={this.closeDialog} />
		);

		const renderPhotomodal = modal.isModalHidden ? null : (
			<PhotoModal modal={modal} updateModal={this.updateModal} />
		);

		return (
			<Div100vh>
				<div className='salliturna' id='salliturna'>
					<TopBar
						keyword={leftframe.search.keyword}
						updateLeftFrame={this.updateLeftFrame}
						dialog={dialog}
						openDialog={this.openDialog}
						searchTopics={this.searchTopics}
					/>
					<LeftFrame
						id={leftframe.rand}
						search={leftframe.search}
						category={leftframe.category}
						isMobileLeftFrameHidden={leftframe.isMobileLeftFrameHidden}
						updateLeftFrame={this.updateLeftFrame}
						updateTopic={this.updateTopic}
						dialog={dialog}
						openDialog={this.openDialog}
					/>
					<Main
						updateLeftFrame={this.updateLeftFrame}
						updateModal={this.updateModal}
						dialog={dialog}
						openDialog={this.openDialog}
					/>
					<Cookie />
					<Footer />
					{renderDialog}
					{renderPhotomodal}
				</div>
			</Div100vh>
		);
	}
}

export default withRouter(connect()(App));
