/* global chrome, handleMessage, registerCustomModule, registerMessageHandler, generateSecureHash */

(function () {
  let cookieConfig = {}

  const annotateCookie = function (cookie) {
    cookie.category = 'Unknown'

    const cookieName = cookie.name.toLowerCase()

    let cookieDomain = null

    if (cookieConfig.annotations !== undefined) {
      if (cookieConfig.annotations[cookie.domain] !== undefined) {
        cookieDomain = cookieConfig.annotations[cookie.domain]
      } else if (cookieConfig.annotations['*'] !== undefined) {
        cookieDomain = cookieConfig.annotations[cookie.domain]
      }
    }

    let cookieSettings = null

    if (cookieDomain !== null) {
      if (cookieDomain[cookieName] !== undefined) {
        cookieSettings = cookieDomain[cookieName]
      } else if (cookieDomain['*'] !== undefined) {
        cookieDomain = cookieDomain['*']
      }
    }

    if (cookieSettings === null || cookieSettings === undefined) {
      // Default configuration

      cookieSettings = {
        category: 'Unknown',
        'keep-value': false
      }
    }

    if (cookieSettings.exclude) {
      cookie.exclude = true
    } else {
      if (cookieSettings.category !== undefined) {
        cookie.category = cookieSettings.category
      }

      if (cookieSettings['keep-value'] !== true) {
        cookie.value = generateSecureHash(cookie.value)
      }
    }
  }

  const recordCookies = function (request, sender, sendResponse) {
    console.log('[Cookie Logger] Recording cookies for ' + request.url + '...')

    if (request.content === 'record_cookies') {
      const payload = {
        'url*': request.url,
        'page-title*': request.pageTitle,
        'top-level': request.topLevel,
        'root-url': sender.tab.url,
        'root-title': sender.tab.title,
        cookies: []
      }

      chrome.cookies.getAll({
        url: request.url
      },
      function (cookies) {
        cookies.forEach(function (cookie) {
          annotateCookie(cookie)

          if (cookie.exclude !== true) {
            payload.cookies.push(cookie)
          }
        })

        if (payload.cookies.length > 0) {
          const newRequest = {
            content: 'record_data_point',
            generator: 'browser-cookies',
            payload: payload // eslint-disable-line object-shorthand
          }

          handleMessage(newRequest, sender, sendResponse)
        }
      })

      return true
    }

    return false
  }

  registerCustomModule(function (config) {
    cookieConfig = config.cookies

    if (cookieConfig === undefined) {
      cookieConfig = {}
    }

    if (cookieConfig.enabled) {
      console.log('[Cookie Logger] Initialized.')

      registerMessageHandler('record_cookies', recordCookies)
    }
  })
})()
