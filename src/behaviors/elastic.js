/**
 * @file behaviors/elastic.js
 *
 */

import { extractNumbers, replaceNumbers } from '../utils/helper'
import Style from '../services/style'

/**
 * Handles the functionality related to elastic effect.
 *
 * @param {Object} animJson
 * @param {Object} options
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
    this.startStyle = this.Style.getData(index)
    this.endStyle = this.Style.getDefault()

    return this.spring(el, index)
  }

  /**
   * Plays the node styles and data styles.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  vault(el, index) {
    this.startStyle = this.Style.getNode(el)
    this.endStyle = this.Style.getData(index)

    return this.spring(el, index)
  }

  /**
   * Plays the node styles and default styles.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  recoil(el, index) {
    this.startStyle = this.Style.getNode(el)
    this.endStyle = this.Style.getDefault()

    return this.spring(el, index)
  }

  /**
   * Starts the elastic animation for each prop.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  spring(el, index) {
    this.settings = this.#getSettings()
    const options = this.#getOptions(index)
    const { duration } = options

    for (const prop in this.startStyle) {
      const keyframes = this.#getKeyframes(prop)
      options.duration = this.#getDuration(duration, keyframes.length)

      const keyframeEffect = new KeyframeEffect(el, keyframes, options)
      const animation = new Animation(keyframeEffect)
      animation.play()
    }

    return duration
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
   * Retrieves the elastic keyframes.
   *
   * @param {string} prop
   * @returns {Array}
   */
  #getKeyframes(prop) {
    this.startVal = this.startStyle[prop]
    this.endVal = this.endStyle[prop]
    let keyframes = []

    const startFrames = this.#getStartFrame()
    keyframes.push({ [prop]: startFrames })

    for (let step = 1; step <= this.settings.frameMax; step += 1) {
      const propFrame = this.#getPropFrame()
      keyframes.push({ [prop]: propFrame })

      if (this.#isThresholdEnd()) {
        break
      }
    }

    const lastFrame = keyframes[keyframes.length - 1]
    const lastArr = lastFrame[prop].split(' ')

    const [endFrame1, endFrame2] = this.#getEndFrames(lastArr)
    keyframes.push({ [prop]: endFrame1 })
    keyframes.push({ [prop]: endFrame2 })

    return keyframes
  }

  /**
   * Fills the current frame based on the computed value.
   *
   */
  #getPropFrame() {
    this.#computeElastic()

    if (this.settings.elastic == 'bounce') {
      this.#filterBounce()
    }

    return replaceNumbers(this.startVal, this.computedArr)
  }

  /**
   * Fills the initial frame based on the start and end values.
   *
   */
  #getStartFrame() {
    this.#resetElastic()

    this.startArr = extractNumbers(this.startVal)
    this.endArr = extractNumbers(this.endVal)
    this.startArr.forEach(() => this.velocityArr.push(0))

    return this.startVal
  }

  /**
   * Fills the last two frames based on the current last frame.
   *
   * @param {string} prop
   * @param {Object} lastFrame
   */
  #getEndFrames(lastArr) {
    const averageArr = []

    this.computedArr.forEach((val, i) => {
      if (lastArr[i]) {
        const base = lastArr[i].includes('scale') ? 1 : 0
        const end = (parseFloat(val) + base) / 2
        averageArr.push(Number(end).toFixed(20))
      }
    })

    const computedStyle = replaceNumbers(this.endVal, averageArr)
    return [computedStyle, this.endVal]
  }

  /**
   * Resets all the status and the computed values.
   *
   */
  #resetElastic() {
    this.computedArr = []
    this.velocityArr = []
    this.displates = 0
    this.threshold = 0
  }

  /**
   * Fills up the computed array with the computed elastic values.
   *
   */
  #computeElastic() {
    this.startArr.forEach((start, index) => {
      this.#updateVelocity(index)
      start = parseFloat(start)

      const elastic = this.velocityArr[index] * this.settings.frameRate
      this.computedArr[index] = Number(start + elastic).toFixed(20)
      this.startArr[index] = this.computedArr[index]
    })
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

    let { delay, duration } = this.animJson
    delay = this.#getDelay(delay, index)

    return {
      fill: 'both',
      easing: 'linear',
      duration,
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
    let { delayAlt, durationAlt } = this.animJson
    delayAlt = this.#getDelay(delayAlt, index)

    return {
      fill: 'both',
      easing: 'linear',
      duration: durationAlt,
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

  /**
   * Retrieves the animation duration.
   *
   * @param {number} duration
   * @param {number} length
   * @returns {number}
   */
  #getDuration(duration, length) {
    let elasticDuration = (length * duration) / 60

    if (duration < elasticDuration) {
      duration = elasticDuration
    }

    return duration
  }

  /**
   * Retrieves the elastic settings.
   *
   * @returns {Object}
   */
  #getSettings() {
    if (this.altOptions && this.animJson.diffOptions) {
      return this.#getAltSettings()
    }

    const { elastic, stiffness, damping, mass } = this.animJson

    return {
      ...this.#getFrameSettings(),
      elastic,
      stiffness,
      damping,
      mass
    }
  }

  /**
   * Retrieves the alt elastic settings.
   *
   * @returns {Object}
   */
  #getAltSettings() {
    const { elasticAlt, stiffnessAlt, dampingAlt, massAlt } = this.animJson

    return {
      ...this.#getFrameSettings(),
      elastic: elasticAlt,
      stiffness: stiffnessAlt,
      damping: dampingAlt,
      mass: massAlt
    }
  }

  /**
   * Retrieves the frame settings.
   *
   * @returns {Object}
   */
  #getFrameSettings() {
    return {
      frameMax: 1000,
      frameMin: 60,
      frameRate: 1 / 60,
      displate: 3
    }
  }

  /**
   * Filters all values for the bounce effect.
   *
   */
  #filterBounce() {
    const filter = (computed, index) => {
      const transArr = this.startVal.split(' ')
      const startArr = extractNumbers(this.startVal)
      const start = startArr[index]

      if (transArr[index].includes('scale')) {
        const adjust = Math.abs(1 - computed)
        return start > 1 ? 1 + adjust : 1 - adjust
      }

      const adjust = Math.abs(computed)
      return start > 0 ? adjust : -adjust
    }

    this.computedArr.forEach((computed, i) => {
      this.computedArr[i] = filter(computed, i)
    })
  }

  /**
   * Checks if the entire keyframe has been satisfied.
   *
   * @returns {boolean}
   */
  #isThresholdEnd() {
    this.#updateDisplates()
    this.#updateThreshold()

    const { frameMin, mass } = this.settings
    const allowedFrames = frameMin * mass

    return this.threshold >= allowedFrames
  }

  /**
   * Retrieves the velocity of a prop given an index.
   *
   * @param {number} index
   */
  #updateVelocity(index) {
    let { stiffness, damping, mass, frameRate } = this.settings
    stiffness = stiffness * -100
    damping = damping * -10
    mass = 10 - mass + 1

    const start = parseFloat(this.startArr[index])
    const end = parseFloat(this.endArr[index])
    const drag = stiffness * (start - end)

    if (drag) {
      const speed = damping * this.velocityArr[index]
      const accel = (drag + speed) / mass
      this.velocityArr[index] += accel * frameRate
    }
  }

  /**
   * Updates the largest displates value.
   *
   * @returns {number}
   */
  #updateDisplates() {
    let squares = 0

    this.computedArr.forEach((computed) => {
      squares += computed ** 2
    })

    const max_displ = Math.max(this.displates || -Infinity, Math.sqrt(squares))
    const min_displ = Math.min(this.displates || Infinity, Math.sqrt(squares))
    this.displates = this.displates < 0 ? max_displ : min_displ
  }

  /**
   * Updates the frames threshold value.
   *
   * @returns {number}
   */
  #updateThreshold() {
    if (Math.abs(this.displates) < this.settings.displate) {
      this.threshold += 1
    } else {
      this.threshold = 0
    }
  }
}
