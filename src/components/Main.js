import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from '../pages/Home.js';
import TopicDraft from '../pages/TopicDraft.js';
import Topic from '../pages/Topic.js';
import Post from '../pages/Post.js';
import Profile from '../pages/Profile.js';
import Venue from '../pages/Venue.js';
import Inbox from '../pages/Inbox.js';
import NotFound from '../pages/NotFound.js';
import VerifyEmail from '../pages/VerifyEmail.js';
import ResetPassword from '../pages/ResetPassword.js';
import Info from '../pages/Info.js';
import Contact from '../pages/Contact.js';
import MuseumList from '../pages/MuseumList.js';
import MovieList from '../pages/MovieList.js';

import '../styles/App.scss';

class Main extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className='content' id='content'>
				<Switch>
					<Route
						exact
						path='/'
						render={(props) => (
							<Home
								{...props}
								openDialog={this.props.openDialog}
								updateLeftFrame={this.props.updateLeftFrame}
								updateModal={this.props.updateModal}
							/>
						)}
					/>
					<Route
						path='/topic/draft'
						render={(props) => (
							<TopicDraft
								{...props}
								openDialog={this.props.openDialog}
								updateLeftFrame={this.props.updateLeftFrame}
							/>
						)}
					/>
					<Route
						path='/topic/:topicid'
						render={(props) => (
							<Topic
								{...props}
								openDialog={this.props.openDialog}
								updateLeftFrame={this.props.updateLeftFrame}
								updateModal={this.props.updateModal}
							/>
						)}
					/>
					<Route
						path='/post/:postid'
						render={(props) => (
							<Post
								{...props}
								openDialog={this.props.openDialog}
								updateModal={this.props.updateModal}
							/>
						)}
					/>
					<Route
						path='/profile/:userid'
						render={(props) => (
							<Profile
								{...props}
								openDialog={this.props.openDialog}
								updateModal={this.props.updateModal}
							/>
						)}
					/>
					<Route
						path='/inbox'
						render={(props) => (
							<Inbox
								{...props}
								openDialog={this.props.openDialog}
								updateModal={this.props.updateModal}
							/>
						)}
					/>
					<Route
						path='/venue/:venueid'
						render={(props) => (
							<Venue
								{...props}
								openDialog={this.props.openDialog}
								updateModal={this.props.updateModal}
							/>
						)}
					/>
					<Route
						path='/verifyemail/:token'
						render={(props) => (
							<VerifyEmail {...props} openDialog={this.props.openDialog} />
						)}
					/>
					<Route
						path='/resetpassword'
						render={(props) => (
							<ResetPassword {...props} openDialog={this.props.openDialog} />
						)}
					/>
					<Route path='/info' component={Info} />
					<Route
						path='/contact'
						render={(props) => (
							<Contact {...props} openDialog={this.props.openDialog} />
						)}
					/>
					<Route
						path='/onlinemuzeler'
						render={(props) => (
							<MuseumList {...props} openDialog={this.props.openDialog} />
						)}
					/>
					<Route
						path='/kendini-iyi-hisset-filmleri'
						render={(props) => (
							<MovieList {...props} openDialog={this.props.openDialog} />
						)}
					/>
					<Route
						path='*'
						render={(props) => (
							<NotFound {...props} openDialog={this.props.openDialog} />
						)}
					/>
				</Switch>
			</div>
		);
	}
}

export default Main;
