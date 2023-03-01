import './App.css'
import posthog from 'posthog-js'
import { Popup } from './Popup'

posthog.init(process.env.REACT_APP_POSTHOG_API_KEY, { api_host: process.env.REACT_APP_POSTHOG_HOST })

function App() {
    return (
        <div className="App">
            <img src="https://posthog.com/brand/posthog-logo.svg" className="App-logo" alt="logo" />
            <header className="App-header">
                <h1>PostHog Popups</h1>
                <p>
                    Powered by{'  '}
                    <a
                        href="https://posthog.com/docs/integrate/client/js#feature-flag-payloads"
                        target="_blank"
                        data-attr="json-link"
                        rel="noopener noreferrer"
                    >
                        JSON Feature Flags
                    </a>
                </p>
            </header>
            <Popup />
        </div>
    )
}

export default App
