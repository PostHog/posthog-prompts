import './App.css'
import { NewFeatureBanner } from './Banner'
import { Popup } from './Popup'
import { PostHogProvider } from 'posthog-js/react'

function App() {
    return (
        <div className="App">
            <NewFeatureBanner />
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
            <PostHogProvider
                apiKey={process.env.REACT_APP_POSTHOG_API_KEY}
                options={{
                    api_host: process.env.REACT_APP_POSTHOG_HOST,
                }}
            >
                <Popup />
            </PostHogProvider>
        </div>
    )
}

export default App
