/**
 * @file behaviors/counter.js
 *
 */

/**
 * Handles the functionality related to counter effect.
 *
 * @param {Object} animJson
 */
export default class {
  constructor(animJson) {
    this.animJson = animJson
    this.altOptions = false

    this.runCounter = this.#updateCount.bind(this)
  }

  /**
   * Starts the counter animation of a prop.
   *
   * @param {Node} el
   * @returns {Object}
   */
  count(el) {
    if (!this.#isValidContent(el)) {
      return false
    }

    const options = this.#getOptions()
    this.startTimestamp = null
    this.el = el

    setTimeout(() => {
      window.requestAnimationFrame(this.runCounter)
    }, options.delay)

    return options.duration
  }

  /**
   * Retrieves the animation options.
   *
   */
  #getOptions() {
    if (this.altOptions && this.animJson.diffOptions) {
      return this.#getAltOptions()
    }

    let { duration, delay } = this.animJson

    return {
      duration,
      delay
    }
  }

  /**
   * Retrieves the alt animation options.
   *
   */
  #getAltOptions() {
    const { durationAlt, delayAlt } = this.animJson

    return {
      duration: durationAlt,
      delay: delayAlt
    }
  }

  /**
   * Displays the new counter based on the progress.
   *
   * @param {number} timestamp
   */
  #updateCount(timestamp) {
    if (!this.startTimestamp) {
      this.startTimestamp = timestamp
    }

    const progress = this.#getProgress(timestamp)
    this.el.innerText = this.#getNewText(progress)

    if (progress < 1) {
      window.requestAnimationFrame(this.runCounter)
    }
  }

  /**
   * Retrieves the progress based on the timestamps.
   *
   * @param {number} timestamp
   * @returns {number}
   */
  #getProgress(timestamp) {
    const { duration } = this.#getOptions()
    const diffTimestamp = timestamp - this.startTimestamp
    const progress = Math.min(diffTimestamp / duration, 1)

    return progress
  }

  /**
   * Retrieves the new counter text given the progress.
   *
   * @param {number} progress
   * @returns {string}
   */
  #getNewText(progress) {
    const start = parseFloat(this.animJson.start)
    const end = parseFloat(this.animJson.end)
    const newText = this.#numberWithCommas(Math.floor(progress * (end - start) + start))

    const format = this.animJson.format || '{counter}'
    return format.replace('{counter}', newText)
  }

  /**
   * Checks if the content is valid for counter.
   *
   */
  #isValidContent(el) {
    const hasNumber = parseInt(el.innerHTML)
    const textNodes = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
    const isTextBlock = textNodes.includes(el.tagName)

    return hasNumber && isTextBlock
  }

  /**
   * Convert a number into a number with commas.
   *
   * @param {number} num
   * @returns {number}
   */
  #numberWithCommas(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
}
