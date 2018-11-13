const cacheName = 'files-chache-1.0.0'
const precacheFiles = [
  '/index.html',
  '/main.js',
  '/styles.css',
  '/manifest.json'
]

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
            response =>
              response || fetchRequest.then(response => response.clone())
          )
      )
  )

  event.waitUntil(
    fetchRequest.then(response =>
      caches.open(cacheName).then(cache => cache.put(request, response.clone()))
    )
  )
})
