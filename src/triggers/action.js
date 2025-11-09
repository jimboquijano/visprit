/**
 * @file triggers/action.js
 *
 */

import { getEffectData } from '../parsers/effect'
import Node from '../services/node'
import Linear from '../behaviors/linear'
import Elastic from '../behaviors/elastic'

/**
 * Handles the playing of different glance effects.
 *
 * @param {Object} animJson
 * @param {Node} el
 * @returns {Object}
 */
export default class {
  constructor(animJson, el) {
    this.animJson = animJson
    this.el = el

    this.effectData = getEffectData(animJson, true)
    this.Node = new Node(animJson, el)
    this.started = false
  }

  /**
   * Starts the animation during a mouse event.
   *
   * @param {string} type
   * @returns {boolean}
   */
  start(type) {
    this.eventType = this.#getEventType(type)

    if (!this.#canPlay()) {
      return false
    }

    this.Node.prepare()

    let duration
    this.Node.traverse((el, index) => {
      duration = this.#playEffect(el, index)
    })

    this.Node.timeout(duration, () => {
      this.lastEvent = this.eventType
    })

    return (this.started = true)
  }

  /**
   * Resets the animation to its initial state.
   *
   */
  reset() {
    if (this.animJson.hasElastic) {
      this.Elastic = new Elastic(this.animJson)

      this.Node.traverse((el) => {
        this.Elastic.revert(el)
      })
    } else {
      this.Linear = new Linear(this.animJson)

      this.Node.traverse((el) => {
        this.Linear.revert(el)
      })
    }
  }

  /**
   * Checks if the animation can play or not.
   *
   * @returns {boolean}
   */
  #canPlay() {
    if (this.#isAnimating() || this.#isAfterCycle()) {
      return false
    }

    return true
  }

  /**
   * Checks if there is an ongoing animation.
   *
   * @returns {boolean}
   */
  #isAnimating() {
    const glanced = this.el.getAttribute('data-swglanced')

    if (glanced && glanced == 0) {
      return true
    }

    return false
  }

  /**
   * Checks if the return animation is after cycle.
   *
   * @returns {boolean}
   */
  #isAfterCycle() {
    if (this.animJson.revert == 'after-cycle' && this.lastEvent == this.eventType) {
      return true
    }

    return false
  }

  /**
   * Plays the action animation to the element.
   *
   * @param {Node} el
   * @param {number} index
   */
  #playEffect(el, index = 0) {
    if (this.animJson.hasElastic) {
      return this.#playElastic(el, index, this.eventType)
    }

    this.Linear = new Linear(this.effectData)

    if (this.eventType == 'in') {
      return this.Linear.stepIn(el, index)
    } else {
      this.Linear.altOptions = true
      return this.Linear.stepOut(el, index)
    }
  }

  /**
   * Plays the elastic action animation to the element.
   *
   * @param {Node} el
   * @param {number} index
   */
  #playElastic(el, index = 0) {
    this.Elastic = new Elastic(this.effectData)

    if (this.eventType == 'in') {
      return this.Elastic.vault(el, index)
    } else {
      this.Elastic.altOptions = true
      return this.Elastic.recoil(el, index)
    }
  }

  /**
   * Retrieves the action event type
   *
   * @returns {boolean}
   */
  #getEventType(type) {
    if (this.animJson.revert == 'when-toggled' && this.lastEvent == type) {
      type = 'out'
    }

    return type
  }
}
