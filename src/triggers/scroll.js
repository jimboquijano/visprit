/**
 * @file triggers/scroll.js
 *
 */

import { getResistData } from '../parsers/resist'
import Node from '../services/node'
import Spire from '../services/spire'
import Linear from '../behaviors/linear'

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

    this.Spire = new Spire(animJson, el)
    this.Node = new Node(animJson, el)
    this.started = false
  }

  /**
   * Starts the animation while scrolling.
   *
   * @param {number} lastScrollY
   * @returns {boolean}
   */
  start(lastScrollY) {
    this.Spire.scroll(lastScrollY)

    if (!this.#canPlay()) {
      return false
    }

    if (!this.started) {
      this.Node.prepare()
    }

    this.Node.traverse((el, index) => {
      this.#playEffect(el, index)
    })

    return (this.started = true)
  }

  /**
   * Resets the animation to its initial state.
   *
   */
  reset() {
    this.Linear = new Linear(this.animJson)

    this.Node.traverse((el) => {
      this.Linear.revert(el)
    })
  }

  /**
   * Checks if the animation can play or not.
   *
   * @returns {boolean}
   */
  #canPlay() {
    if (this.#isAnimating() || this.#isThwarted()) {
      return false
    }

    if (!this.Spire.hasUnveiled()) {
      return !this.Spire.unveiled
    }

    if (!this.Spire.activated) {
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
   * Checks if the scroll animation is thwarted.
   *
   * @returns {boolean}
   */
  #isThwarted() {
    const stopWidth = parseFloat(this.animJson.stopWidth) || 0

    if (this.animJson.hasStop && stopWidth > window.innerWidth) {
      return true
    }

    return false
  }

  /**
   * Plays the scroll animation to the element.
   *
   * @param {Node} el
   * @param {number} index
   */
  #playEffect(el, index = 0) {
    const resistData = getResistData(this.animJson, this.Spire.crank)
    this.Linear = new Linear(resistData)

    return this.Linear.stepIn(el, index)
  }
}
