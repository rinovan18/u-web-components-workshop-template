/* TODO: SLIDE 42 */
import { LitElement, css, html } from 'lit';
/* TODO SLIDE 110.1 */

/* TODO: SLIDE 43 */
/**
 * `u-footer`
 * a footer including university mark and required footer links
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @element u-footer
 */

/* TODO: SLIDE 44 */
class UFooter extends LitElement {
  /* TODO: SLIDE 45 */
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-footer';
  }

  /* TODO: SLIDE 46 */
  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      css`
        /* TODO: SLIDE 52 */
      `,
    ];
  }

  /* TODO: SLIDE 47 */
  static get properties() {
    return {
      /* TODO: SLIDE 110.2 */
    };
  }

  /* TODO: SLIDE 48 */
  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    return html`
      <!-- TODO: SLIDE 111 -->
      <ul>
        <!-- TODO: SLIDE 51 -->
      </ul>`;
  }

  /* TODO: SLIDE 49 */
  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from LitEelement runs
    super();
  }
}

/* TODO: SLIDE 50 */
window.customElements.define(UFooter.tag, UFooter);
export { UFooter };
