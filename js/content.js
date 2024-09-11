/* global chrome, locationFilterMatches */

(function () {
  console.log('[Cookie Logger] Code loaded...')

  window.registerModuleCallback(function (config) {
    if (config['cookie-filters'] === undefined || locationFilterMatches(window.location, config['cookie-filters'])) {
      let isTopLevel = false
      
      try {
        isTopLevel = window.location === window.parent.location
      } catch (ex) {
        // Security block - not at top level.
        console.log(ex)
      }

      console.log(`[Cookie Logger] Recording cookies from ${window.location} (${isTopLevel})...`)

      chrome.runtime.sendMessage({
        content: 'record_cookies',
        url: window.location.href,
        pageTitle: document.title,
        topLevel: isTopLevel
      })
    } else {
      console.log(`[Cookie Logger] Skipping ${window.location}.`)
    }
  })
})(); // eslint-disable-line semi, no-trailing-spaces
