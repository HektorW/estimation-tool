const estimateInputEl = document.querySelector('[data-input-estimate]')
const multiplyInputEl = document.querySelector('[data-input-multiply]')
const addInputEl = document.querySelector('[data-input-add]')
const resultEl = document.querySelector('[data-result]')

const updateResults = () => {
  const estimate = parseFloat(estimateInputEl.value) || 0
  const multiply = parseFloat(multiplyInputEl.value) || 1
  const addHours = parseFloat(addInputEl.value) || 0

  resultEl.innerHTML =
    estimate === 0 ? 0 : roundResult(estimate * multiply + addHours)
}

const resizeInput = event => {
  const target = event.target
  const span = target.parentNode.querySelector('.hidden')
  span.textContent = target.value
  target.style.width = span.offsetWidth + 'px'
}

const roundResult = value =>
  Number.isNaN(value)
    ? 0
    : isInteger(value)
    ? value
    : (Math.round(value * 4) / 4).toFixed(2)

const isInteger = value => Math.round(value) === value
;[estimateInputEl, multiplyInputEl, addInputEl].forEach(el => {
  el.addEventListener('input', updateResults)
  el.addEventListener('input', resizeInput)
  window.addEventListener('resize', () => resizeInput({ target: el }))
  resizeInput({ target: el })
})

updateResults()
estimateInputEl.focus()

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(
    () => {
      console.log('Service worker is registered.')
    },
    error => {
      console.log('Failed to register service worker.', error)
    }
  )

  navigator.serviceWorker.onmessage = event => {
    const { data } = event
    if (data === 'refresh') {
      toast(`
        <div>There is a new version of the page available.</div>
        <div><a href="/" onclick="event.preventDefault();window.location.reload()">Refresh</a> the page to use the latest version 🤗.</div>
      `)
    }
  }
}

const toast = (() => {
  let showTimeoutId = null
  let removeTimeoutId = null
  let toastContainerEl = null

  const removeToastEl = () => {
    if (toastContainerEl)
      toastContainerEl.parentElement.removeChild(toastContainerEl)
    toastContainerEl = null
    clearTimeout(removeTimeoutId)
  }

  return (toastContent, removeMs = 10000) => {
    clearTimeout(showTimeoutId)
    showTimeoutId = setTimeout(() => {
      removeToastEl()

      toastContainerEl = document.createElement('div')

      toastContainerEl.innerHTML = `
          <div class="toast">
            <button></button>
            ${toastContent}
          </div>
        `

      toastContainerEl.querySelector('button').onclick = removeToastEl

      document.body.appendChild(toastContainerEl)

      removeTimeoutId = setTimeout(() => {
        const toastEl = toastContainerEl.querySelector('.toast')
        toastEl.classList.add('remove')
        toastEl.addEventListener('animationend', removeToastEl)
      }, removeMs)
    }, 1000)
  }
})()
