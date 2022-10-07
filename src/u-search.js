/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, css, html, svg } from 'lit';
import { uA11yStyles } from './u-a11y-styles.js';

/**
  * `u-search`
  * is a basic button for rich text editor (custom buttons can extend RichTextEditorButtonBehaviors)
  * 
  * ### Styling`
Custom property | Description | Default
----------------|-------------|----------
--color | text color of search | currentColor
--border | border of search | 1px solid
--border-radius | border-radius of search | 0
--font-family | font-family of search | inherit
--font-size | font-family of search | inherit
--internal-height | internal height of search | 24px
--internal-padding | internal padding of search | 8px
--input-color | text color of search input | currentColor
--input-background-color | background color of search input | transparent
--input-border| border of search input | none
--input-font-family | font-family of input | var(--font-family,inherit)
--input-font-size | font-size of input | var(--font-size,inherit))
--button-color | text color of search button | ccurrentColor
--button-background-color | background color of search button | transparent
--button-border | border of search button | none
--button-font-family | font-family of search button | var(--font-family,inherit)
--button-font-size,var(--font-size,inherit))
--icon-color | search icon color | var(--button-color,currentColor)
``
  * 
  * 
  * @customElement
  * @lit-html
  * @lit-element
  * @element u-search
  */
class uSearch extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'u-search';
  }

  /**
   * array of CSS styles to be attached to shadowDOM
   */
  static get styles() {
    return [
      //add visually hiddent styles for accessibility
      ...uA11yStyles,
      css`
        :host {
          display: inline-flex;
          align-items: center;
          color: var(--color,currentColor);
          border: var(--border,1px solid);
          border-radius: var(--border-radius,0);
          margin: 5px 10px;
          font-family: var(--font-family,inherit);
          font-size: var(--font-size,inherit);
        }
        [hidden] {
          display: none!important;
        }
        #search-text, 
        #search-button {
          display: flex;
          align-items: center;
        }
        #search-text,
        #search-text-input {
          flex: 1 1 auto;
        }
        #search-button,
        #search-button > *, 
        #search-text-label {
          flex: 0 0 auto;
        }
        #search-text-input {
          color: var(--input-color,currentColor);
          background-color: var(--input-background-color,transparent);
          line-height: var(--internal-height,24px);
          padding: var(--internal-padding,8px);
          border: var(--input-border,none);
          border-radius: var(--border-radius,0) 0 0 var(--border-radius,0);
          width: 100%;
          max-width: 100%;
          transition: width 0.5s ease-in-out;
          font-family: var(--input-font-family,var(--font-family,inherit));
          font-size: var(--input-font-size,var(--font-size,inherit));
        }
        :host([toggles]):not([toggled]) #search-button {
          max-width: 0;
        }
        #search-button {
          padding: var(--internal-padding,8px);
          color: var(--button-color,currentColor);
          background-color: var(--button-background-color,transparent);
          border: var(--button-border,none);
          border-radius: var(--border-radius,0);
        }
        :host([toggles][toggled]) #search-button {
          border-radius: 0 var(--border-radius,3px) var(--border-radius,0) 0;
        }
        #search-button-label {
          margin-right: 0.5em;
          font-family: var(--button-font-family,var(--font-family,inherit));
          font-size: var(--button-font-size,var(--font-size,inherit));
        }
        #search-icon {
          width: var(--internal-height,24px);
          height: var(--internal-height,24px);
          fill: var(--icon-color,var(--button-color,currentColor));
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * show label for search button
       */
      buttonLabel: {
        type: String,
        attribute: 'button-label',
        reflect: true,
      },
      /**
       * show label for text input
       */
      inputLabel: {
        type: String,
        attribute: 'input-label',
        reflect: true,
      },
      /**
       * show label for text input
       */
      showInputLabel: {
        type: Boolean,
        attribute: 'show-input-label',
        reflect: true,
      },
      /**
       * show label for search button
       */
      showButtonLabel: {
        type: Boolean,
        attribute: 'show-button-label',
        reflect: true,
      },
      /**
       * whether search input is toggled open
       */
      toggled: {
        type: Boolean,
        attribute: 'toggled',
        reflect: true,
      },
      /**
       * whether search button is used to toggle search input
       */
      toggles: {
        type: Boolean,
        attribute: 'toggles',
        reflect: true,
      },
    };
  }

  /**
   * template used to render HTML in shadowDOM
   */
  render() {
    return html`
      <div id="search-text" 
        ?hidden="${this.toggles && !this.toggled}">
        <label 
          id="search-text-label" 
          for="type="text-input" 
          class="${this.showInputLabel ? '' : 'visually-hidden'}">
          ${this.inputLabel || 'Search Text'}
        </label>
        <input id="search-text-input" type="text" placeholder="${
          this.showInputLabel ? '' : this.inputLabel || 'Search Text'
        }"/>
      </div>
      <!-- TODO: SLIDE 79 -->
      <button id="search-button" controls="search-text">
        <span id="search-button-label" class="${
          this.showButtonLabel && !(this.toggles && this.toggled)
            ? ''
            : 'visually-hidden'
        }">${this.buttonLabel || 'Search'}</span>
        <svg id="search-icon" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false">
          <g>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </g>
        </svg>
      </button>`;
  }

  /**
   * Called when element is created and also when
   * custom element is loaded after element is already in DOM.
   * Useful for setting initial property values.
   */
  constructor() {
    //make sure anything it extended from lit runs
    super();
    this.buttonLabel = 'Search';
    this.inputLabel = 'Search Text';
    this.showInputLabel = false;
    this.showButtonLabel = false;
    this.toggled = false;
    this.toggles = false;
  }

  /**
   * gets search input from shadow DOM
   * @returns {object} input DOM node
   */
  get input() {
    return this.shadowRoot && this.shadowRoot.querySelector('input')
      ? this.shadowRoot.querySelector('input')
      : false;
  }

  /**
   * gets search button from shadow DOM
   * @returns {object} button DOM node
   */
  get button() {
    return this.shadowRoot && this.shadowRoot.querySelector('button')
      ? this.shadowRoot.querySelector('button')
      : false;
  }

  /* TODO: SLIDE 80 */

  /* TODO: SLIDE 81 */
}
window.customElements.define(uSearch.tag, uSearch);
export { uSearch };
