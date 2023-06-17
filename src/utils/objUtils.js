function safeStringify(obj) {
  try {
    return JSON.stringify(obj)
  } catch (_err) {
    return ''
  }
}


function safeParse(str, defaultVal) {
  try {
    return JSON.parse(str)
  } catch (_err) {
    return defaultVal || {}
  }
}

module.exports = {
  safeStringify,
  safeParse
}