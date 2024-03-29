/* global chrome, handleMessage, registerCustomModule, registerMessageHandler */

const recordCookies = function (request, sender, sendResponse) {
  console.log('[Cookie] Recording cookies for ' + request.url + '...')

  if (request.content === 'record_cookies') {
    const payload = {
      'url*': request.url,
      'page-title*': request.pageTitle,
      cookies: []
    }

    chrome.cookies.getAll({
      url: request.url
    },
    function (cookies) {
      cookies.forEach(function (cookie) {
        console.log(cookie.name + ' --> ' + cookie.name)
        console.log(cookie)

        payload.cookies.push(cookie)
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
  console.log('[Cookies] Initialized.')

  registerMessageHandler('record_cookies', recordCookies)
})
