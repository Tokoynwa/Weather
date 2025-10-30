// Cookie Consent Management for Google Consent Mode v2

// Check if user has already made a consent choice
function checkConsentStatus() {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
        const consentData = JSON.parse(consent);
        updateConsent(consentData);
        return true;
    }
    return false;
}

// Update Google Consent Mode
function updateConsent(consentData) {
    gtag('consent', 'update', {
        'ad_storage': consentData.ad_storage,
        'ad_user_data': consentData.ad_user_data,
        'ad_personalization': consentData.ad_personalization,
        'analytics_storage': consentData.analytics_storage
    });
}

// Accept all cookies
function acceptAllCookies() {
    const consentData = {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        analytics_storage: 'granted'
    };

    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    updateConsent(consentData);
    hideCookieBanner();

    // Track consent event
    gtag('event', 'consent_update', {
        'consent_type': 'all_accepted'
    });
}

// Accept only necessary cookies
function acceptNecessaryCookies() {
    const consentData = {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
    };

    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    updateConsent(consentData);
    hideCookieBanner();

    // Track consent event
    gtag('event', 'consent_update', {
        'consent_type': 'necessary_only'
    });
}

// Toggle cookie settings panel
function toggleCookieSettings() {
    const settingsPanel = document.getElementById('cookieSettings');
    if (settingsPanel.style.display === 'none') {
        settingsPanel.style.display = 'block';
    } else {
        settingsPanel.style.display = 'none';
    }
}

// Save custom cookie preferences
function saveCustomCookies() {
    const analyticsChecked = document.getElementById('analyticsCookies').checked;
    const adChecked = document.getElementById('adCookies').checked;

    const consentData = {
        ad_storage: adChecked ? 'granted' : 'denied',
        ad_user_data: adChecked ? 'granted' : 'denied',
        ad_personalization: adChecked ? 'granted' : 'denied',
        analytics_storage: analyticsChecked ? 'granted' : 'denied'
    };

    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    updateConsent(consentData);
    hideCookieBanner();

    // Track consent event
    gtag('event', 'consent_update', {
        'consent_type': 'custom',
        'analytics_enabled': analyticsChecked,
        'ads_enabled': adChecked
    });
}

// Hide cookie banner
function hideCookieBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
        banner.style.display = 'none';
    }
}

// Show cookie banner if no consent given
function showCookieBanner() {
    const banner = document.getElementById('cookieConsent');
    if (banner) {
        banner.style.display = 'block';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    const hasConsent = checkConsentStatus();

    if (!hasConsent) {
        // Show banner after 1 second delay for better UX
        setTimeout(showCookieBanner, 1000);
    } else {
        hideCookieBanner();
    }
});

// Allow users to reset consent (can be called from browser console)
function resetConsent() {
    localStorage.removeItem('cookieConsent');
    location.reload();
}
