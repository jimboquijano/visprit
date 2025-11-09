/**
 * @file services/event.js
 *
 */

/**
 * Listens for mouse events to trigger the action animation.
 *
 * @param {Object} action
 */
export default class {
  constructor(action) {
    this.action = action

    this.triggerEls = this.#getTriggers()
    this.eventTypes = this.#getTypes()
  }

  /**
   * Starts listening for each trigggers.
   *
   */
  listen() {
    const { revert } = this.action.animJson
    this.timeouts = []
    this.inAborters = []
    this.outAborters = []

    Array.prototype.forEach.call(this.triggerEls, (triggerEl, index) => {
      this.actionIn(triggerEl, index)

      if (revert == 'after-event') {
        this.actionOut(triggerEl, index)
      }
    })
  }

  /**
   * Listens for action in type events.
   *
   * @param {Node} triggerEl
   * @param {number} index
   */
  actionIn(triggerEl, index) {
    this.inAborters[index] = new AbortController()
    const { revert, duration } = this.action.animJson

    triggerEl.addEventListener(
      this.eventTypes.in,
      () => {
        this.action.start('in')

        if (revert == 'after-cycle') {
          clearTimeout(this.timeouts[index])

          this.timeouts[index] = setTimeout(() => {
            this.action.start('out')
          }, duration)
        }
      },
      { signal: this.inAborters[index].signal }
    )
  }

  /**
   * Listens for action out types events.
   *
   * @param {Node} triggerEl
   * @param {number} index
   */
  actionOut(triggerEl, index) {
    this.outAborters[index] = new AbortController()

    triggerEl.addEventListener(
      this.eventTypes.out,
      () => {
        this.action.start('out')
      },
      { signal: this.outAborters[index].signal }
    )
  }

  /**
   * Unlistens the action in and out events.
   *
   */
  unlisten() {
    this.inAborters.forEach((aborter) => {
      aborter.abort()
    })

    this.outAborters.forEach((aborter) => {
      aborter.abort()
    })
  }

  /**
   * Retrieves the triggers to play animation.
   *
   * @returns {Array}
   */
  #getTriggers() {
    const { trigger, triggerEl } = this.action.animJson
    const el = this.action.el
    let els = [el]

    if (trigger == 'children' && triggerEl) {
      els = el.querySelectorAll(':scope > ' + triggerEl)
    }

    if (trigger == 'ancestor' && triggerEl) {
      els = [el.closest(triggerEl)]
    }

    return els
  }

  /**
   * Retrieves the event types for the triggers.
   *
   * @returns {Object}
   */
  #getTypes() {
    const { actionEvent } = this.action.animJson
    let inEvent = 'mouseenter'
    let outEvent = 'mouseleave'

    if (actionEvent == 'click') {
      inEvent = 'mousedown'
      outEvent = 'mouseup'
    }

    return {
      in: inEvent,
      out: outEvent
    }
  }
}
