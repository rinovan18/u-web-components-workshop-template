import { LitElement, css } from 'lit';
import { uSocialIconSvgs } from './u-social-icon-svgs.js';

/**
 * `u-social-icon`
 * social media icons
 *
 * ### Styling`
Custom property | Description | Default
---------------|-------------|----------
--current-color | color of SVG | currentcolor
`
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-social-icon
 */
class uSocialIcon extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-social-icon';
  }

  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          width:30px;
          height:30px
        }

        [hidden] {
          display: none!important;
        }
        svg {
          fill: var(--current-color, currentColor);
          margin: 3%;
          width: 94%;
          height: 94%;
        }
        :host([colorize][type="facebook"]) svg {
          fill: #1B74E4;
        }
        :host([colorize][type="instagram"]) svg {
          fill: #c1558b;
        }
        :host([colorize][type="twitter"]) svg{
          fill: rgb(29, 155, 240);
        }
        :host([colorize][type="youtube"]) svg {
          fill: rgb(255, 0, 0);
        }
        :host([icon-style][type]) svg {
          fill: var(--current-color, currentColor);
          filter: contrast(9999%) grayscale(100%) invert(100%);
          margin: 15%;
          width: 70%;
          height: 70%;
        }
        :host([icon-style][type]){
          background-color: var(--current-color, currentColor);
        }
        :host([icon-style="round"]) {
          border-radius: 50%;
        }
        :host([icon-style="rounded"]) {
          border-radius: 3px;
        }
        :host([colorize][icon-style][type="facebook"]) {
          background-color: #1B74E4;
        }
        :host([colorize][icon-style][type="instagram"]) {
          background-color: #c1558b;
        }
        :host([colorize][icon-style][type="twitter"]) {
          background-color: rgb(29, 155, 240);
        }
        :host([colorize][icon-style][type="youtube"]) {
          background-color: rgb(255, 0, 0);
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * can be "round", "rounded" or default squared
       */
      iconStyle: {
        type: String,
        attribute: 'icon-style',
      },
      /**
       * social media type, as in "facebook", "instagram", "twitter", or "youtube"
       */
      type: {
        type: String,
        attribute: 'type',
        reflect: true,
      },
      /**
       * if true, icon wil be color of its brand instead of inherited color
       */
      colorize: {
        type: Boolean,
        attribute: 'colorize',
        reflect: true,
      },
    };
  }

  /**
   * template used to render SVG in shadowDOM
   */
  render() {
    return !this.type || !uSocialIconSvgs[this.type]
      ? ''
      : uSocialIconSvgs[this.type];
  }

  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();
  }

  /**
   * Called after component's DOM has been updated first time.
   * Useful for initial access to attributes and shadow DOM.
   */
  firstUpdated(changedProperties) {
    //hide svg from screen reader
    this.setAttribute('aria-hidden', true);
    //make sure anything it extended from lit runs
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
  }
}
window.customElements.define(uSocialIcon.tag, uSocialIcon);
export { uSocialIcon };
