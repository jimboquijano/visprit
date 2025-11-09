/**
 * @file utils/helper.js
 *
 */

/**
 * Coverts the anim json into string.
 *
 * @param {Object} json
 * @returns {string}
 */
export const jsonToStrx = (json) => {
  const str = JSON.stringify(json)

  return str
    .replaceAll('":"', ':')
    .replaceAll('":', ':')
    .replaceAll(':"', ':')
    .replaceAll('","', '|')
    .replaceAll('",', '|')
    .replaceAll(',"', '|')
    .replaceAll('{"', '')
    .replaceAll('"}', '')
    .replaceAll('{', '')
    .replaceAll('}', '')
}

/**
 * Coverts the anim string into json.
 *
 * @param {string} str
 * @returns {Object}
 */
export const strxToJson = (str) => {
  const pairs = str.split('|')
  const json = {}

  pairs.forEach((pair) => {
    let [key, value] = pair.split(':')

    if (!isNaN(value)) {
      value = Number(value)
    }

    if (['true', 'false', 'null'].includes(value)) {
      value = JSON.parse(value)
    }

    if (value == 'null') {
      value = null
    }

    json[key] = value
  })

  return json
}

/**
 * Extracts all numbers from a string.
 *
 * @param {string} str
 * @returns {Array}
 */
export const extractNumbers = (str = '') => {
  var regex = /[+-]?\d+(\.\d+)?/g
  return str.toString().match(regex) || []
}

/**
 * Replaces all numbers from a string given an array of numbers as reference.
 *
 * @param {string} str
 * @param {Array} arr
 * @returns {Array}
 */
export const replaceNumbers = (str = '', arr = []) => {
  var regex = /[+-]?\d+(\.\d+)?/g
  var count = -1

  return (
    str.toString().replace(regex, () => {
      return arr[++count]
    }) || []
  )
}

/**
 * Retrieves the display type of an element.
 *
 * @param {Node} el
 * @returns {string}
 */
export const getDisplayType = (el) => {
  const cStyle = el.currentStyle || window.getComputedStyle(el, '')
  return cStyle.display
}

/**
 * Retrieves the best perspective on an element.
 *
 * @param {Node} el
 * @returns {string}
 */
export const getBestPerspective = (el) => {
  return Math.min(el.offsetHeight * 4, el.offsetWidth * 4, window.innerWidth) + 'px'
}
