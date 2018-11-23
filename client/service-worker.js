const cacheName = 'files-chache-1.0.0'
const precacheFiles = ['/', '/main.js', '/styles.css', '/manifest.json']

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(precacheFiles))
  )
})

self.addEventListener('fetch', event => {
  const { request } = event

  const fetchRequest = fetch(request)

  event.respondWith(
    caches
      .open(cacheName)
      .then(cache =>
        cache
          .match(request)
          .then(
            cachedResponse =>
              cachedResponse || fetchRequest.then(response => response.clone())
          )
      )
  )

  event.waitUntil(
    fetchRequest.then(response =>
      caches.open(cacheName).then(cache =>
        cache.match(request).then(cachedResponse => {
          if (
            cachedResponse &&
            cachedResponse.headers.get('etag') !== response.headers.get('etag')
          ) {
            sendMessage('refresh')
          }

          return cache.put(request, response.clone())
        })
      )
    )
  )
})

const sendMessage = message =>
  self.clients.matchAll().then(clients => {
    if (clients) {
      clients.forEach(client => client.postMessage(message))
    }
  })
