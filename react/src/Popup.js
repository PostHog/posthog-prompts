import React, { useState, useEffect } from 'react'

import './Popup.css'

import EXAMPLE_FLAG_POPUP from './example-flag-popup.json'

import posthog from 'posthog-js'
import { generateLocationCSS, generateTooltipPointerStyle } from './popup-location'

const DEBUG_SHOW_LOCAL_POPUP = false
const DEBUG_IGNORE_LOCAL_STORAGE = false

function getFeatureSessionStorageKey(featureFlagName) {
    return `ph-popup-${featureFlagName}`
}

function shouldShowPopup(featureFlagName) {
    const flagNotShownBefore = !localStorage.getItem(getFeatureSessionStorageKey(featureFlagName))

    return flagNotShownBefore || DEBUG_IGNORE_LOCAL_STORAGE
}

function sendPopupEvent(event, flag, payload, buttonType = null) {
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

function closePopUp(featureFlagName, payload, setShowPopup, buttonType) {
    setShowPopup(false)
    localStorage.setItem(getFeatureSessionStorageKey(featureFlagName), true)
    posthog.people.set({ ['$' + featureFlagName]: new Date().toDateString() })

    if (payload.primaryButtonURL && buttonType === 'primary') {
        window.open(payload.primaryButtonURL, '_blank')
    }

    sendPopupEvent('popup closed', featureFlagName, payload, buttonType)
}

export function findRelativeElement(cssSelector) {
    const el = document.querySelector(cssSelector)
    if (!el) {
        throw new Error(`Could not find element with CSS selector: ${cssSelector}`)
    }
    return el
}

export function Popup() {
    const [showPopup, setShowPopup] = useState(false)
    const [payload, setPayload] = useState({})
    const [locationCSS, setLocationCSS] = useState({})
    const [activeFlag, setActiveFlag] = useState(null)

    function initPopUp(payload, flag) {
        setPayload(payload)
        try {
            setLocationCSS(generateLocationCSS(payload.location, payload.locationCSSSelector))
        } catch (e) {
            console.error(e)
            return
        }
        if (shouldShowPopup(flag)) {
            setActiveFlag(flag)
            setShowPopup(true)

            sendPopupEvent('popup shown', flag, payload)
        }
    }

    useEffect(() => {
        if (DEBUG_SHOW_LOCAL_POPUP) {
            initPopUp(EXAMPLE_FLAG_POPUP, 'popup-example')
        } else {
            posthog.onFeatureFlags((flags) => {
                for (const flag of flags) {
                    if (flag.startsWith('popup-') && posthog.isFeatureEnabled(flag)) {
                        const payload = posthog.getFeatureFlagPayload(flag)
                        initPopUp(payload, flag)
                        return
                    }
                }
            })
        }
    }, [])

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
                            onClick={() => closePopUp(activeFlag, payload, setShowPopup, 'secondary')}
                        >
                            {payload.secondaryButtonText}
                        </button>
                    )}
                    {payload.primaryButtonText && (
                        <button
                            className="popup-book-button"
                            onClick={() => closePopUp(activeFlag, payload, setShowPopup, 'primary')}
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
