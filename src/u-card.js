import { LitElement, css, html } from 'lit';

/**
 * `u-card`
 * is a basic card container
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-card
 */
class uCard extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-card';
  }

  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin: 15px 0;
          max-width: 100%;
          position: relative;
        }
        [hidden] {
          display: none!important;
        }
        :host,
        div[part=body]{
          display: flex;
          flex-direction: column;
        }
        div[part=body]{
          padding: 0.75rem;
          flex-grow: 1;
        }
        div[part=body] ::slotted(:not([slot=image]):nth-of-type(2)) {
          margin-top: 0.75rem;
        }
        div[part=body] ::slotted(:not([slot=image]):first-of-type) {
          margin-top: 0;
        }
        div[part=body] ::slotted(:not([slot=image]):last-child) {
          margin-top: auto;
        }
        div[part=body] ::slotted(:not([slot=image]):nth-last-child(2)) {
          margin-bottom: 0.75rem;
        }
        ::slotted(img[slot=image]) {
          display: block;
          object-fit: cover;
          height: 100%;
          width: 100%;
        }
        /* position behind */
        :host([image-position=behind]) [part=body] {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 0;
          color: white;
        }
        :host([image-position=behind]) [part=body] ::slotted(a) {
          color: white;
        }

        /* clickable card */
        :host([clickable]) ::slotted([slot=link]):after {
          content: ' ';
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }
        :host([clickable]:hover),
        :host([clickable]:focus-within) {
          outline: 1px solid;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * position of card "behind" or "above" (default)
       * (future development may include "left", "right" and "below" options)
       */
      imagePosition: {
        type: String,
        attribute: 'image-position',
        reflect: true,
      },
      /**
       * sets entire card area to link
       */
      clickable: {
        type: Boolean,
        attribute: 'clickable',
        reflect: true,
      },
    };
  }

  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    return html`
        <div part="image">
          <!-- TODO: SLIDE 63.1 -->
        </div>
        <div part="body">
          <!-- TODO: SLIDES 61 & 63.2 -->
          <h1>Card Heading</h1>
          <p>Card content.</p>
          <a href="#">Card Link</a>
        </div>
    `;
  }

  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();
    this.clickable = false;
  }
}
window.customElements.define(uCard.tag, uCard);
export { uCard };
