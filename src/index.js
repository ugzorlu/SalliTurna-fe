import React from 'react'
import { createRoot } from 'react-dom/client'

/* External Libraries */
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'

/* Internal Components */
import { HelmetPriorityManagerProvider } from './components/Helmet'

/* Pages */
import App from './App'

/* Constants and Helpers */
import reducer from './reducers'

const store = createStore(reducer)
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
    <Provider store={store}>
        <Router>
            <HelmetProvider>
                <HelmetPriorityManagerProvider>
                    <App />
                </HelmetPriorityManagerProvider>
            </HelmetProvider>
        </Router>
    </Provider>
)
