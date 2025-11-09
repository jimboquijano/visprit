/**
 * @file services/spire.js
 *
 */

/**
 * Handles the functionality related to scrolling.
 *
 * @param {Object} animJson
 * @param {Node} el
 * @returns {Object}
 */
export default class {
  constructor(animJson, el) {
    this.animJson = animJson
    this.el = el

    this.activated = true
    this.unveiled = false
    this.peeked = false

    if (animJson.hasActivate) {
      this.activated = false
    }
  }

  /**
   * Runs the sprire's vertical scrolling mechanism.
   *
   * @param {number} lastScrollY
   * @returns {number}
   */
  scroll(lastScrollY) {
    this.lastScrollY = lastScrollY

    this.stride = this.#getStride()
    this.resist = this.#getResist()
    this.crank = this.stride / this.resist

    this.#checkActivation()
  }

  /**
   * Checkes if the element has peeked in the viewport.
   *
   * @returns {boolean}
   */
  hasPeeked() {
    if (this.#isPeekedIntoView(this.animJson.peek)) {
      return (this.peeked = true)
    }

    return false
  }

  /**
   * Checkes if the element has unveiled in the viewport.
   *
   * @returns {boolean}
   */
  hasUnveiled() {
    if (this.#isPeekedIntoView(0)) {
      return (this.unveiled = true)
    }

    return false
  }

  /**
   * Retrieves the scroll stride of the vertical scroll.
   *
   * @param {number} lastScrollY
   * @returns {number}
   */
  #getStride() {
    if (!this.elDistanceTop) {
      const rect = this.el.getBoundingClientRect()
      this.elDistanceTop = this.#getFrameScroll() + rect.top
      this.elOffsetHeight = this.el.offsetHeight
    }

    const originScroll = this.#getFrameScroll() + this.#getOrigin()
    const scrollStride = originScroll - this.elDistanceTop

    return -scrollStride
  }

  /**
   * Retrieves the resistance value based on the scroll.
   *
   * @returns {number}
   */
  #getResist() {
    const scrollDistance = this.#getFrameScroll() - this.lastScrollY
    let resistance = this.animJson.resistDown

    if (scrollDistance < 0) {
      resistance = this.animJson.resistUp
    }

    return resistance
  }

  /**
   * Checks for the activiation given the scroll stride.
   *
   */
  #checkActivation() {
    if (!this.firstStride) {
      this.firstStride = this.stride
    }

    if (this.firstStride < 0 && this.stride >= 0 && !this.activated) {
      this.activated = true
    }

    if (this.firstStride > 0 && this.stride <= 0 && !this.activated) {
      this.activated = true
    }
  }

  /**
   * Retrieves the scroll origin based on the element height.
   *
   * @returns {number}
   */
  #getOrigin() {
    const windowHeight = this.#getFrameHeight()
    let origin = (windowHeight - this.elOffsetHeight) / 2

    if (this.animJson.origin == 'top') {
      origin = 0
    } else if (this.animJson.origin == 'bottom') {
      origin = windowHeight - this.elOffsetHeight
    } else if (this.animJson.origin == 'custom' && this.animJson.originSize) {
      origin = parseFloat(this.animJson.originSize)

      if (this.animJson.originSize.includes('%')) {
        origin = windowHeight * (parseFloat(this.animJson.originSize) / 100)
      }
    }

    return origin
  }

  /**
   * Checks if an element is within the viewport given a threshold.
   *
   * @param {number} percentVisible
   * @returns {boolean}
   */
  #isPeekedIntoView(percentVisible) {
    let rect = this.el.getBoundingClientRect()
    let windowHeight = this.#getFrameHeight()

    const peekTop = (rect.top >= 0 ? 0 : rect.top) / +-rect.height
    const peekBottom = (rect.bottom - windowHeight) / rect.height

    return !(
      Math.floor(100 - peekTop * 100) < percentVisible ||
      Math.floor(100 - peekBottom * 100) < percentVisible
    )
  }

  /**
   * Retrives the window or frame scroll.
   *
   * @returns {number}
   */
  #getFrameScroll() {
    if (this.frame) {
      return this.frame.documentElement?.scrollTop || this.frame.scrollTop || 0
    }

    return window.scrollY || 0
  }

  /**
   * Retrieves the window or frame height.
   *
   * @returns {number}
   */
  #getFrameHeight() {
    if (this.frame) {
      return this.frame.documentElement?.clientHeight || this.frame.clientHeight
    }

    return window.innerHeight
  }
}
