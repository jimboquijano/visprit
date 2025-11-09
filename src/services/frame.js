/**
 * @file services/frame.js
 *
 */

/**
 * Listens for frame scroll to trigger the scroll animation.
 *
 * @param {Object} scroll
 */
export default class {
  constructor(scroll) {
    this.scroll = scroll
    this.frame = this.#getFrame()
    this.aborter = null
  }

  /**
   * Starts listening for window scrolling.
   *
   */
  listen() {
    let lastScrollY = 0
    this.aborter = new AbortController()
    this.scroll.Spire.frame = this.frame

    this.frame.addEventListener(
      'scroll',
      () => {
        this.scroll.start(lastScrollY)

        lastScrollY = document.documentElement?.scrollTop || document.scrollTop
      },
      { signal: this.aborter.signal }
    )
  }

  /**
   * Unlistens the frame scrolling event.
   *
   */
  unlisten() {
    if (this.aborter) {
      this.aborter.abort()
    }
  }

  /**
   * Retrieves the frame to listen for scrolling.
   *
   */
  #getFrame() {
    const iframe =
      document.getElementsByName('editor-canvas')[0] ||
      document.getElementsByClassName('.edit-post-visual-editor')[0]

    const region = document.getElementsByClassName('interface-interface-skeleton__content')[0]

    if (iframe) {
      return iframe.contentWindow.document
    } else {
      return region
    }
  }
}
