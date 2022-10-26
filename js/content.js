/* global chrome, locationFilterMatches */

window.registerModuleCallback(function (config) {
  // console.log('[Cookies] Checking host...')
  // console.log(config)

  if (locationFilterMatches(window.location, config['cookie-filters'])) {
    console.log('[Cookies] Recording cookies from ' + window.location + '...')
    chrome.runtime.sendMessage({
      content: 'record_cookies',
      url: window.location.href,
      pageTitle: document.title
    })
  } else {
    console.log('[Cookies] Skipping ' + window.location + '.')
  }
})
