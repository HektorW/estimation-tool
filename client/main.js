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
        <div>Refresh the page to see it.</div>
      `)
    }
  }
}

const toast = (() => {
  let timeoutId = null
  let toastEl = null

  const removeToastEl = () => {
    if (toastEl) toastEl.parentElement.removeChild(toastEl)
    toastEl = null
  }

  return toastContent => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      removeToastEl()

      toastEl = document.createElement('div')

      toastEl.innerHTML = `
          <div class="toast">
            <button></button>
            ${toastContent}
          </div>
        `

      toastEl.querySelector('button').onclick = removeToastEl

      document.body.appendChild(toastEl)
    }, 1000)
  }
})()
