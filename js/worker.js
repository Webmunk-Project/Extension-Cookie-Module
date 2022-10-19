/* global chrome, handleMessage, registerCustomExtension, registerMessageHandler */

const recordCookies = function (request, sender, sendResponse) {
  console.log('[Cookie] Recording cookies for ' + request.url + '...')

  if (request.content === 'record_cookies') {
    console.log('[Cookies] Fetching cookies...')

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
    })

    const newRequest = {
      content: 'record_data_point',
      generator: 'browser-cookies',
      payload: payload
    }

    return handleMessage(newRequest, sender, sendResponse)
  }

  return false
}

registerCustomExtension(function (config) {
  console.log('[Cookies] Service worker initialized.')
  console.log(config)

  registerMessageHandler('record_cookies', recordCookies)
})
