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
