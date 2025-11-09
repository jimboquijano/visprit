/**
 * @file triggers/glance.js
 *
 */

import { getEffectData } from '../parsers/effect'
import Node from '../services/node'
import Spire from '../services/spire'
import Linear from '../behaviors/linear'
import Counter from '../behaviors/counter'
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

    this.effectData = getEffectData(animJson)
    this.Spire = new Spire(animJson, el)
    this.Node = new Node(animJson, el)
    this.started = false
  }

  /**
   * Starts the animation within the viewport.
   *
   * @returns {boolean}
   */
  start() {
    if (!this.#canPlay()) {
      return false
    }

    this.Node.prepare(() => {
      this.el.setAttribute('data-swglanced', 0)
    })

    let duration
    this.Node.traverse((el, index) => {
      duration = this.#playEffect(el, index)
    })

    this.Node.timeout(duration, () => {
      this.el.setAttribute('data-swglanced', 1)
      this.Node.unprepare()
    })

    return (this.started = true)
  }

  /**
   * Checks if the animation can play or not.
   *
   * @returns {boolean}
   */
  #canPlay() {
    if (!this.Spire.hasPeeked() || this.started) {
      return false
    }

    return true
  }

  /**
   * Plays the glance animation to the element.
   *
   * @param {Node} el
   * @param {number} index
   * @returns {Object}
   */
  #playEffect(el, index = 0) {
    this.Linear = new Linear(this.effectData)
    this.Linear.fadeInEarly(el, index)

    if (this.animJson.hasCounter) {
      this.Counter = new Counter(this.effectData)
      return this.Counter.count(el, index)
    }

    if (this.animJson.hasElastic) {
      this.Elastic = new Elastic(this.effectData)
      return this.Elastic.tread(el, index)
    }

    return this.Linear.tread(el, index)
  }
}
