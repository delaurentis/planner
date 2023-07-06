
// Set a flag that allows the app to know whenever we're typing in a field anywhere
// so that we can ignore keyboard shortcuts that happen on mouseover of various elements in the page
const setupKeyboardFiltering = () => {
  window.addEventListener('focusin', () => { window['ignoreKeyboardShortcuts'] = true })
  window.addEventListener('focusout', () => { window['ignoreKeyboardShortcuts'] = false })
}

export { setupKeyboardFiltering }