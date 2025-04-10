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
      :host {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  container-name: host;
}

[hidden] {
    display: none!important;
}
:host([invert]),
:host([invert]) a {
  color: white;
}
ul {
  margin: 40px auto 20px;
  list-style-type: none;
  position: relative;
  padding: 0;
}
li {
  display: block;
}
u-mark {
  width: 100px;
  flex: 0 0 auto;
}
@media (min-width:800px) {
  :host { 
    flex-wrap: nowrap;
  }
  u-mark {
    width: 120px;
    flex: 0 0 auto;
  }
  ul {
    text-align: center;
  }
  li {
    display: inline-block;
    line-height: 1.25;
    padding: 0 1em;
    margin-bottom: 1em;
    border-left: 1px solid #888;
  }
  li:first-child {
    border-left: none;
  }
}
      
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
         <li>

           <a href="#privacy-statement">Privacy</a>
         </li>
         <li>
          <a href="#ad85">Non-discrimaniton</a>
         </li>
         <li>
          <a href="#hr11">Equal Opportunity</a>
        </li>
        <li>
          <a href="#accessibility-statement">Accessibility</a>
        </li>
        <li>
          <a href="#copyright-information" >Copyright</a>
        </li>
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
