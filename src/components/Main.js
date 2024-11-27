import React, { Component, createRef, lazy, Suspense } from 'react'

/* External Libraries */
import { Switch, Route, withRouter } from 'react-router-dom'

/* Internal Components */
import Spinner from '../components/Spinner'

/* Pages */
// Splits code via lazy loading.
const Home = lazy(() => import('../pages/Home.js'))
const TopicDraft = lazy(() => import('../pages/TopicDraft.js'))
const Topic = lazy(() => import('../pages/Topic.js'))
const Post = lazy(() => import('../pages/Post.js'))
const Profile = lazy(() => import('../pages/Profile.js'))
const Venue = lazy(() => import('../pages/Venue.js'))
const Inbox = lazy(() => import('../pages/Inbox.js'))
const NotFound = lazy(() => import('../pages/NotFound.js'))
const VerifyEmail = lazy(() => import('../pages/VerifyEmail.js'))
const ResetPassword = lazy(() => import('../pages/ResetPassword.js'))
const Info = lazy(() => import('../pages/Info.js'))
const Contact = lazy(() => import('../pages/Contact.js'))
const MuseumList = lazy(() =>
    import('../pages/List.js').then((module) => ({
        default: module.MuseumList,
    }))
)
const MovieList = lazy(() =>
    import('../pages/List.js').then((module) => ({ default: module.MovieList }))
)

/* Constants and Helpers */
import { scrollToTop } from '../utils/commons'

/* Styling */
import '../styles/App.scss'

class Main extends Component {
    constructor(props) {
        super(props)
        this.topScrollRef = createRef()
    }

    componentDidMount() {
        scrollToTop(this.topScrollRef)
    }

    componentDidUpdate() {
        scrollToTop(this.topScrollRef)
    }

    render() {
        return (
            <div className="content" ref={this.topScrollRef}>
                <Suspense fallback={<Spinner />}>
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/topic/draft" component={TopicDraft} />
                        <Route path="/topic/:topicid" component={Topic} />
                        <Route path="/post/:postid" component={Post} />
                        <Route path="/profile/:userid" component={Profile} />
                        <Route path="/inbox" component={Inbox} />
                        <Route path="/venue/:venueid" component={Venue} />
                        <Route
                            path="/verifyemail/:token"
                            component={VerifyEmail}
                        />
                        <Route
                            path="/resetpassword"
                            component={ResetPassword}
                        />
                        <Route path="/info" component={Info} />
                        <Route path="/contact" component={Contact} />
                        <Route path="/online-muzeler" component={MuseumList} />
                        <Route
                            path="/iyi-hisset-filmleri"
                            component={MovieList}
                        />
                        <Route path="*" component={NotFound} />
                    </Switch>
                </Suspense>
            </div>
        )
    }
}

// Exports component with React Router.
export default withRouter(Main)
