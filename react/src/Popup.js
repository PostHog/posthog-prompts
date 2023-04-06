import React, { useState, useEffect } from 'react'

import './Popup.css'

import { useActiveFeatureFlags, usePostHog } from 'posthog-js/react'
import { generateLocationCSS, generateTooltipPointerStyle } from './popup-location'

function getFeatureSessionStorageKey(featureFlagName) {
    return `ph-popup-${featureFlagName}`
}

function shouldShowPopup(featureFlagName) {
    // The feature flag should have be disabled for the user once the popup has been shown
    // This is a second check for shorter-term preventing of the popup from showing
    const flagNotShownBefore = !localStorage.getItem(getFeatureSessionStorageKey(featureFlagName))

    return flagNotShownBefore
}

function sendPopupEvent(event, flag, payload, posthog, buttonType = null) {
    if (buttonType) {
        posthog.capture(event, {
            popupFlag: flag,
            popupPayload: payload,
            popupButtonPressed: buttonType,
        })
    } else {
        posthog.capture(event, {
            flag: flag,
            payload: payload,
        })
    }
}

function closePopUp(featureFlagName, payload, setShowPopup, buttonType, posthog) {
    setShowPopup(false)
    localStorage.setItem(getFeatureSessionStorageKey(featureFlagName), true)
    posthog.people.set({ ['$' + featureFlagName]: new Date().toDateString() })

    if (payload.primaryButtonURL && buttonType === 'primary') {
        window.open(payload.primaryButtonURL, '_blank')
    }

    sendPopupEvent('popup closed', featureFlagName, payload, posthog, buttonType)
}

export function findRelativeElement(cssSelector) {
    const el = document.querySelector(cssSelector)
    if (!el) {
        throw new Error(`Could not find element with CSS selector: ${cssSelector}`)
    }
    return el
}

function initPopUp(payload, flag, setPayload, setActiveFlag, setLocationCSS, setShowPopup, posthog) {
    if (!payload || !payload.location) {
        // indicates that it's not a valid popup
        return
    }

    setPayload(payload)
    try {
        setLocationCSS(generateLocationCSS(payload.location, payload.locationCSSSelector))
    } catch (e) {
        console.error(e)
        return
    }
    if (shouldShowPopup(flag) || true) {
        setActiveFlag(flag)
        setShowPopup(true)

        sendPopupEvent('popup shown', flag, payload, posthog)
    }
}

export function Popup() {
    const [showPopup, setShowPopup] = useState(false)
    const [payload, setPayload] = useState({})
    const [locationCSS, setLocationCSS] = useState({})
    const [activeFlag, setActiveFlag] = useState(null)
    const posthog = usePostHog()
    const activeFlags = useActiveFeatureFlags()

    useEffect(() => {
        if (!activeFlags) {
            return
        }
        for (const flag of activeFlags) {
            if (flag.startsWith('flag-') && posthog?.isFeatureEnabled(flag)) {
                const payload = posthog?.getFeatureFlagPayload(flag)
                initPopUp(payload, flag, setPayload, setActiveFlag, setLocationCSS, setShowPopup, posthog)
                return
            }
        }
    }, [activeFlags, posthog])

    return (
        <div className="popup" style={{ display: showPopup ? 'flex' : 'none', ...locationCSS }}>
            <div className="contents">
                {payload?.title && <h2 className="title">{payload.title}</h2>}
                {payload?.body && <div className="body" dangerouslySetInnerHTML={{ __html: payload.body }} />}
            </div>
            <div className="bottom-section">
                <div
                    className="buttons"
                    style={{
                        justifyContent: payload.primaryButtonText ? 'space-between' : 'center',
                    }}
                >
                    {payload?.secondaryButtonText && (
                        <button
                            className="popup-close-button"
                            onClick={() => closePopUp(activeFlag, payload, setShowPopup, 'secondary', posthog)}
                        >
                            {payload.secondaryButtonText}
                        </button>
                    )}
                    {payload.primaryButtonText && (
                        <button
                            className="popup-book-button"
                            onClick={() => closePopUp(activeFlag, payload, setShowPopup, 'primary', posthog)}
                        >
                            {payload.primaryButtonText}
                        </button>
                    )}
                </div>
            </div>
            {payload?.location && (
                <div
                    style={{
                        ...generateTooltipPointerStyle(payload.location),
                    }}
                />
            )}
        </div>
    )
}
