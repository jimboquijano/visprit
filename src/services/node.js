/**
 * @file services/node.js
 *
 */

import Anim from '../resolvers/anim'
import Prep from '../resolvers/prep'
import Unprep from '../resolvers/unprep'

/**
 * Handles all funcationality related to node elements.
 *
 * @param {Node} el
 */
export default class {
  constructor(animJson, el) {
    this.animJson = animJson
    this.el = el
    this.els = this.#getAnimEls()
  }

  /**
   * Prepares each anim elements.
   *
   * @param {function} callback
   */
  prepare(callback) {
    for (const resolver in Prep) {
      Prep[resolver]({
        animJson: this.animJson,
        el: this.el,
        els: this.els
      })
    }

    if (callback) callback()
  }

  /**
   * Unprepares each anim elements.
   *
   */
  unprepare() {
    for (const resolver in Unprep) {
      Unprep[resolver]({
        animJson: this.animJson,
        el: this.el,
        els: this.els
      })
    }
  }

  /**
   * Invokes a callback within a timeout.
   *
   * @param {number} duration
   * @param {function} callback
   */
  timeout(duration = null, callback) {
    clearTimeout(this._timeout)

    this._timeout = setTimeout(() => {
      if (callback) callback()
    }, duration || this.#getTimeout())
  }

  /**
   * Traverses through each anim elements.
   *
   * @param {function} callback
   * @returns {string}
   */
  traverse(callback) {
    this.els.forEach((el, index) => {
      callback(el, index)
    })
  }

  /**
   * Retrives all anim elements based on the tinks.
   *
   * @returns {NodeList}
   */
  #getAnimEls() {
    let els = []

    for (const resolver in Anim) {
      els = Anim[resolver]({
        animJson: this.animJson,
        el: this.el
      })

      if (els !== false) {
        break
      }
    }

    return els || [this.el]
  }

  /**
   * Retrieves the timeout based on the total interval.
   *
   * @returns {number}
   */
  #getTimeout() {
    const { duration, delay } = this.animJson
    const totaInterval = this.#getTotalInterval()

    return duration + delay + totaInterval
  }

  /**
   * Retrieves the invertal based on the total anim elements.
   *
   * @returns {number}
   */
  #getTotalInterval() {
    const { cascadeEl, cascadeInt } = this.animJson
    let totaInterval = 0

    if (cascadeEl) {
      totaInterval = (this.els.length - 1) * (cascadeInt || 0)
    }

    return totaInterval
  }
}
