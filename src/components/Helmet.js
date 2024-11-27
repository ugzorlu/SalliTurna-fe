import React, { Component } from 'react'

/* External Libraries */
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet-async'

/* Constants and Helpers */
export const HELMET_PRIORITY = {
    HIGH: 2,
    LOW: 1,
}

const createHelmetPriorityManager = () => {
    let highestPriority = Number.NEGATIVE_INFINITY

    return {
        shouldRender(priority) {
            if (priority >= highestPriority) {
                highestPriority = priority
                return true
            }
            return false
        },

        resetPriority() {
            highestPriority = Number.NEGATIVE_INFINITY
        },
    }
}

const HelmetPriorityManagerContext = React.createContext(
    createHelmetPriorityManager()
)

class HelmetPriorityManagerProvider extends Component {
    constructor(props) {
        super(props)
        this.priorityManager = createHelmetPriorityManager()
    }

    render() {
        return (
            <HelmetPriorityManagerContext.Provider value={this.priorityManager}>
                {this.props.children}
            </HelmetPriorityManagerContext.Provider>
        )
    }
}

class TitleHelmet extends Component {
    static contextType = HelmetPriorityManagerContext

    render() {
        const { title, description, priority } = this.props
        const priorityManager = this.context

        // Ensures title is valid.
        if (!title) return null

        // Shows only the title with the highest prority to handle duplication and override.
        if (!priorityManager.shouldRender(priority)) return null

        return (
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>
        )
    }
}
TitleHelmet.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    priority: PropTypes.number.isRequired,
}

class EventHelmet extends Component {
    static contextType = HelmetPriorityManagerContext

    render() {
        const { event, priority } = this.props
        const priorityManager = this.context

        // Ensures event JSON is valid and has valid event proporties.
        if (!event || typeof event !== 'object') return null

        const requiredProperties = ['@context', '@type', 'name', 'startDate']
        for (const prop of requiredProperties) {
            if (!(prop in event)) return null
        }

        // Shows only the event metadata with the highest prority to handle duplication and override.
        if (!priorityManager.shouldRender(priority)) return null

        return (
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(event)}
                </script>
            </Helmet>
        )
    }
}
EventHelmet.propTypes = {
    event: PropTypes.object.isRequired,
    priority: PropTypes.number.isRequired,
}

export { HelmetPriorityManagerProvider, TitleHelmet, EventHelmet }
