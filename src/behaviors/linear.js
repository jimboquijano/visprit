/**
 * @file behaviors/linear.js
 *
 */

import { getEasings } from '../utils/panel'
import Style from '../services/style'

/**
 * Handles the functionality related to the linear effect.
 *
 * @param {Object} animJson
 */
export default class {
  constructor(animJson) {
    this.animJson = animJson
    this.altOptions = false

    this.Style = new Style(this.animJson)
  }

  /**
   * Plays the data styles and default styles.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  tread(el, index) {
    const startStyle = this.Style.getData(index)
    const endStyle = this.Style.getDefault()
    const options = this.#getOptions(index)

    const keyframes = [startStyle, endStyle]
    const keyframeEffect = new KeyframeEffect(el, keyframes, options)
    const animation = new Animation(keyframeEffect)
    animation.play()

    return options.duration
  }

  /**
   * Plays only the data styles.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  stepIn(el, index) {
    const startStyle = this.Style.getData(index)
    const options = this.#getOptions(index)
    delete options.delay

    const keyframes = [startStyle]
    const keyframeEffect = new KeyframeEffect(el, keyframes, options)
    const animation = new Animation(keyframeEffect)
    animation.play()

    return options.duration
  }

  /**
   * Plays only the default styles.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  stepOut(el, index) {
    const endStyle = this.Style.getDefault()
    const options = this.#getOptions(index)
    delete options.delay

    const keyframes = [endStyle]
    const keyframeEffect = new KeyframeEffect(el, keyframes, options)
    const animation = new Animation(keyframeEffect)
    animation.play()

    return options.duration
  }

  /**
   * Plays and early fade in.
   *
   * @param {Node} el
   * @param {Node} index
   */
  fadeInEarly(el, index) {
    const startStyle = { opacity: 0 }
    const endStyle = { opacity: 1 }

    const options = this.#getOptions(index)
    const fade = this.animJson.fade / 100
    options.duration = options.duration * fade

    const keyframes = [startStyle, endStyle]
    const keyframeEffect = new KeyframeEffect(el, keyframes, options)
    const animation = new Animation(keyframeEffect)
    animation.play()
  }

  /**
   * Plays only the reset styles abruptly.
   *
   * @param {Node} el
   * @returns {Object}
   */
  revert(el) {
    const endStyle = this.Style.getReset()
    const options = { fill: 'both', duration: 0 }

    const keyframes = [endStyle]
    const keyframeEffect = new KeyframeEffect(el, keyframes, options)
    const animation = new Animation(keyframeEffect)
    animation.play()

    return options.duration
  }

  /**
   * Retrieves the animation options.
   *
   * @param {number} index
   * @returns {object}
   */
  #getOptions(index) {
    if (this.altOptions && this.animJson.diffOptions) {
      return this.#getAltOptions(index)
    }

    let { duration, easing, delay } = this.animJson
    delay = this.#getDelay(delay, index)
    easing = getEasings()[easing]

    return {
      fill: 'both',
      duration,
      easing,
      delay
    }
  }

  /**
   * Retrieves the alt animation options.
   *
   * @param {number} index
   * @returns {object}
   */
  #getAltOptions(index) {
    let { durationAlt, easingAlt, delayAlt } = this.animJson
    delayAlt = this.#getDelay(delayAlt, index)
    easingAlt = getEasings()[easingAlt]

    return {
      fill: 'both',
      duration: durationAlt,
      easing: easingAlt,
      delay: delayAlt
    }
  }

  /**
   * Retrieves the animation delay.
   *
   * @param {number} delay
   * @param {number} index
   * @returns {object}
   */
  #getDelay(delay, index) {
    const interval = (this.animJson.cascadeInt || 0) * index

    if (delay) {
      delay = delay + interval
    }

    return delay
  }
}
